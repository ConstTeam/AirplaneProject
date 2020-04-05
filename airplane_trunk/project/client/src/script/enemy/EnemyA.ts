import BulletControl from "../BulletControl";
import BulletA from "../bullet/BulletA";
import Enemy from "./Enemy";
import Bullet from "../bullet/Bullet";

export default class EnemyA extends Enemy
{
	private Back(): void
	{
		Laya.Tween.to(this._sp, {x: this._iFromX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}

	private _iTimes1: number;
	private _iTimes2: number;

	protected ShowCompleted(): void
	{
		this._iTimes1 = 0;
		this._iTimes2 = 0;
		Laya.timer.loop(500, this, this.Shoot);
	}

	private Shoot(): void
	{
		Laya.timer.loop(100, this, this._Shoot);
		if(++this._iTimes1 > 1)
		{
			Laya.timer.clear(this, this.Shoot);
			this._iTimes1 = 0;
			this.Back();
		}
	}

	private _Shoot(): void
	{
		let bulletSp: Laya.Sprite = BulletControl.GetInst().PopBullet("BulletA");
		let bullet: Bullet = bulletSp.getComponent(Bullet);
		bullet.Excute("BulletA", this._sp.x + 153, this._sp.y + 61);
		if(++this._iTimes2 > 2)
		{
			Laya.timer.clear(this, this._Shoot);
			this._iTimes2 = 0;
		}	
	}
}