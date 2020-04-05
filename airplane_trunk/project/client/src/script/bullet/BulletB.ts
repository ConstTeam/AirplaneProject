import Bullet from "./Bullet";

export default class BulletB extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number): void
	{
		super.Excute(bulletName, fromX, fromY);
		Laya.Tween.to(this._sp, {y: fromY + 100}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.DropCompleted))
	}

	private DropCompleted(): void
	{
		Laya.timer.once(1000, this, this.Shoot)
	}

	private Shoot(): void
	{
		Laya.Tween.to(this._sp, {x: 3000}, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop))
	}
}