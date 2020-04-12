export default class MainRole extends Laya.Script
{
	private _sp: Laya.Sprite;
	private _rigidbody: Laya.RigidBody;
	private _setHpHandler: Laya.Handler;
	private _stopCbHandler: Laya.Handler;
	private _explosionSP: Laya.Sprite;
	private _explosionAni: Laya.Animation;
	private _bInvincible: boolean;
	private _iLife: number;
	private _bottomBox: Laya.BoxCollider;
	private _bottomBox2: Laya.BoxCollider;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this._rigidbody = this.owner.getComponent(Laya.RigidBody);
		this._Reset();
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		if(this._sp.x == -10000)
			return;

		let otherSp: Laya.Sprite = other.owner as Laya.Sprite;

		if(otherSp.name == "Top")
			return;

		if(otherSp.name == "Life")
		{
			if(this._iLife < 5)
			{
				this._setHpHandler.runWith(++this._iLife);
				otherSp.destroy();
			}
			return;
		}

		if(this._bInvincible)
			return;

		if(this._iLife > 0)
		{
			this._setHpHandler.runWith(--this._iLife);
			this.SetInvincible();
			return;
		}	

		this.RigidBodyEnable(false);
		this._stopCbHandler.run();
		this._explosionSP.x = this._sp.x;
		this._explosionSP.y = this._sp.y;
		this._explosionAni.play(0, false);
		Laya.SoundManager.playSound("sound/explosion.wav");
		Laya.timer.once(1000, this, this.HideExplosion)
		this._sp.x = -10000;

		if(otherSp.name != "Bottom")
			otherSp.destroy();
	}

	private HideExplosion(): void
	{
		this._explosionSP.x = -10000;
	}

	public Init(setHpHander: Laya.Handler, stopCbHandler: Laya.Handler, explosionSP: Laya.Sprite, expolsionAni: Laya.Animation, bottom: Laya.Sprite, bottom2: Laya.Sprite): void
	{
		this._setHpHandler = setHpHander;
		this._stopCbHandler = stopCbHandler;
		this._explosionSP = explosionSP;
		this._explosionAni = expolsionAni;
		this._bottomBox = bottom.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
		this._bottomBox2 = bottom2.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
		this._bottomBox.enabled = true;
		this._bottomBox2.enabled = false;
	}

	public Reset(): void
	{
		this._Reset();
		this._bottomBox.enabled = true;
		this._bottomBox2.enabled = false;
	}

	private _Reset(): void
	{
		this._iLife = 0;
		this._sp.x = 959;
		this._sp.y = 539;
		this.RigidBodyEnable(false);
	}

	public RigidBodyEnable(bEnable: boolean): void
	{
		this._rigidbody.enabled = bEnable;
	}

	public SetInvincible(): void
	{
		this._bInvincible = true;
		this._bottomBox.enabled = false;
		this._bottomBox2.enabled = true;
		Laya.timer.loop(100, this, this.InvincibleEffect);
		Laya.timer.once(3000, this, this.ClearInvincible);
	}

	private InvincibleEffect(): void
	{
		this._sp.visible = !this._sp.visible;
	}

	private ClearInvincible(): void
	{
		Laya.timer.clear(this, this.InvincibleEffect);
		this._sp.visible = true;
		this._bInvincible = false;
		this._bottomBox.enabled = true;
		this._bottomBox2.enabled = false;
	}

	public Up(): void
	{
		this._rigidbody.setVelocity({x: 0, y: -12});
	}
}