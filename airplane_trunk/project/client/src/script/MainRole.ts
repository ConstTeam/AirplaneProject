export default class MainRole extends Laya.Script
{
	private _rigidbody: Laya.RigidBody;

	onAwake(): void
	{
		this._rigidbody = this.owner.getComponent(Laya.RigidBody);
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		console.log("-------------------------------");
	}

	public Init(): void
	{
		this.RigidBodyEnable(false);
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