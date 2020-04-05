import Enemy from "./Enemy";
import BulletControl from "../BulletControl";
import BulletB from "../bullet/BulletB";
import Bullet from "../bullet/Bullet";

export default class EnemyB extends Enemy
{
	protected ShowCompleted(): void
	{
		this.Shoot();
	}

	private Shoot(): void
	{
		let bulletSp: Laya.Sprite = BulletControl.GetInst().PopBullet("BulletB");
		let bullet: Bullet = bulletSp.getComponent(Bullet);
		bullet.Excute("BulletB", this._sp.x + 30, this._sp.y + 61);
		Laya.timer.once(2000, this, this.Back);
	}

	private Back(): void
	{
		Laya.Tween.to(this._sp, {x: this._iFromX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}
}