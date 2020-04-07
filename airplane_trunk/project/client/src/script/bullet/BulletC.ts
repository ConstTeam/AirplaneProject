import Bullet from "./Bullet";

export default class BulletC extends Bullet
{
	private _rigidBody: Laya.RigidBody;

	constructor() { super(); }

	onAwake(): void
	{
		super.onAwake();
		this._rigidBody = this.owner.getComponent(Laya.RigidBody);
		this._rigidBody.enabled = false;
	}

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		super.Excute(bulletName, fromX, fromY, direction);
		this._rigidBody.enabled = true;
		this._rigidBody.setVelocity({x: direction ? 15 : -15, y: 0});
	}

	onTriggerEnter(other:any, self:any, contact:any): void
	{
		let sp: Laya.Sprite = other.owner as Laya.Sprite;
		if(sp.name == "Bottom")
		{
			this._rigidBody.enabled = false;
			this.Stop();
		}
	}
}