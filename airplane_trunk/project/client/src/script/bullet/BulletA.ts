import Bullet from "./Bullet";

export default class BulletA extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number): void
	{
		super.Excute(bulletName, fromX, fromY);
		Laya.Tween.to(this._sp, {x: 3000}, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop))
	}
}