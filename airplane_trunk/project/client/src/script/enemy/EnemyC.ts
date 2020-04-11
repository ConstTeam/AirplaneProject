import Enemy from "./Enemy";
import PositionMgr from "../common/PositionMgr";

export default class EnemyC extends Enemy
{
	protected ShowCompleted(): void
	{
		this.Shoot();
	}

	protected Shoot(): void
	{
		this._Shoot();
		this.Back();
	}

	protected _Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletCL" : "BulletCR");
	}

	protected Back(): void
	{
		let toX: number = this._sp.scaleX == 1 ? PositionMgr.RightX : PositionMgr.LeftX;
		Laya.Tween.to(this._sp, {x: toX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}
}