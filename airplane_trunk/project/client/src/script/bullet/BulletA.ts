import Bullet from "./Bullet";
import PositionMgr from "../common/PositionMgr";

export default class BulletA extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		super.Excute(bulletName, fromX, fromY, direction);
		Laya.Tween.to(this._sp, {x: direction == 1 ? PositionMgr.RightX : PositionMgr.LeftX}, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop))
	}
}