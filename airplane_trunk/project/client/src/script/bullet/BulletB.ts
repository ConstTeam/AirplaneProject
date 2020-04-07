import Bullet from "./Bullet";
import PositionMgr from "../common/PositionMgr";

export default class BulletB extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		super.Excute(bulletName, fromX, fromY, direction);
		Laya.Tween.to(this._sp, {y: fromY + 100}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.DropCompleted))
	}

	private DropCompleted(): void
	{
		Laya.timer.once(1000, this, this.Shoot)
	}

	private Shoot(): void
	{
		Laya.Tween.to(this._sp, {x: this._iDirection == 1 ? PositionMgr.RightX : PositionMgr.LeftX}, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop))
	}
}