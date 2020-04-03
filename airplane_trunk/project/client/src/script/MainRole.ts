import BulletA from "./BulletA";

export default class MainRole extends Laya.Script
{
	private _rigidbody: Laya.RigidBody;
	private _stopCbHandler: Laya.Handler;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._rigidbody = this.owner.getComponent(Laya.RigidBody);
		this.RigidBodyEnable(false);
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		this.RigidBodyEnable(false);
		this._stopCbHandler.run();
		let sp: Laya.Sprite = other.owner as Laya.Sprite;
		if(sp.name == "BulletA")
		{
			sp.visible = false;
			sp.getComponent(BulletA).Stop();
		}
	}

	public Init(stopCbHandler: Laya.Handler): void
	{
		this._stopCbHandler = stopCbHandler;
	}

	public RigidBodyEnable(bEnable: boolean): void
	{
		this._rigidbody.enabled = bEnable;
	}

	public Up(): void
	{
		this._rigidbody.setVelocity({x: 0, y: -10});
	}
}