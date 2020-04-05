import Enemy from "./Enemy";
import BulletControl from "../BulletControl";
import Bullet from "../bullet/Bullet";
import PositionMgr from "../common/PositionMgr";

export default class EnemyC extends Enemy
{
	protected ShowCompleted(): void
	{
		this.Shoot();
	}

	private Shoot(): void
	{
		let bulletSp: Laya.Sprite = BulletControl.GetInst().PopBullet("BulletC");
		let bullet: Bullet = bulletSp.getComponent(Bullet);
		bullet.Excute("BulletC", this._sp.x + 30, this._sp.y + 70);
		this.Back();
	}

	private Back(): void
	{
		let toX: number = this._sp.scaleX == 1 ? PositionMgr.RightX : PositionMgr.LeftX;
		Laya.Tween.to(this._sp, {x: toX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}
}