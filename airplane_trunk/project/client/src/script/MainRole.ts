import BulletA from "./BulletA";

export default class MainRole extends Laya.Script
{
	private _sp: Laya.Sprite;
	private _rigidbody: Laya.RigidBody;
	private _stopCbHandler: Laya.Handler;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this._rigidbody = this.owner.getComponent(Laya.RigidBody);
		this.Reset();
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		let sp: Laya.Sprite = other.owner as Laya.Sprite;
		if(sp.name == "Top")
			return;
		
		this.RigidBodyEnable(false);
		this._stopCbHandler.run();
		if(sp.name == "Bottom")
			return;
		
		sp.destroy();
	}

	public Init(stopCbHandler: Laya.Handler): void
	{
		this._stopCbHandler = stopCbHandler;
	}

	public Reset(): void
	{
		this._sp.x = 878;
		this._sp.y = 491;
		this.RigidBodyEnable(false);
	}

	public RigidBodyEnable(bEnable: boolean): void
	{
		this._rigidbody.enabled = bEnable;
	}

	public Up(): void
	{
		this._rigidbody.setVelocity({x: 0, y: -12});
	}
}