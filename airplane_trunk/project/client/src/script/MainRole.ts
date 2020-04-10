export default class MainRole extends Laya.Script
{
	private _sp: Laya.Sprite;
	private _rigidbody: Laya.RigidBody;
	private _stopCbHandler: Laya.Handler;
	private _explosionSP: Laya.Sprite;
	private _explosionAni: Laya.Animation;
	private _bInvincible: boolean;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this._rigidbody = this.owner.getComponent(Laya.RigidBody);
		this.Reset();
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		if(this._sp.x == -10000)
			return;

		let otherSp: Laya.Sprite = other.owner as Laya.Sprite;
		let bBottom: boolean = otherSp.name == "Bottom"
		if(this._bInvincible && !bBottom)
			return;
		
		if(otherSp.name == "Top")
			return;
		
		this.RigidBodyEnable(false);
		this._stopCbHandler.run();
		this._explosionSP.x = this._sp.x;
		this._explosionSP.y = this._sp.y;
		this._explosionAni.play(0, false);
		Laya.SoundManager.playSound("sound/explosion.wav");
		Laya.timer.once(1000, this, this.HideExplosion)
		this._sp.x = -10000;

		if(!bBottom)
			otherSp.destroy();	
	}

	private HideExplosion(): void
	{
		this._explosionSP.x = -10000;
	}

	public Init(stopCbHandler: Laya.Handler, explosionSP: Laya.Sprite, expolsionAni: Laya.Animation): void
	{
		this._stopCbHandler = stopCbHandler;
		this._explosionSP = explosionSP;
		this._explosionAni = expolsionAni;
	}

	public Reset(): void
	{
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
	}

	public Up(): void
	{
		this._rigidbody.setVelocity({x: 0, y: -12});
	}
}