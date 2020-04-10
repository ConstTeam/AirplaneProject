import PositionMgr from "../common/PositionMgr";
import BulletControl from "../BulletControl";
import Bullet from "../bullet/Bullet";

export default class Enemy extends Laya.Script
{
	protected _enemyName: string;
	protected _sp: Laya.Sprite;
	protected _iFromX: number;
	protected _iFromY: number;
	protected _iDirection: number;

	protected _iBulletCount: number;
	protected _iTimes: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Show(info: any[]): void
	{
		this._enemyName = info[0];
		this._iDirection = info[1];
		this._sp.x = this._iFromX = this._iDirection == 1 ? PositionMgr.LeftX : PositionMgr.RightX;
		this._sp.y = this._iFromY = info[2];
		Laya.Tween.to(this._sp, {x: info[3]}, info[4], Laya.Ease.linearNone, Laya.Handler.create(this, this.ShowCompleted));
	}

	protected ShowCompleted(): void
	{
		this.BackCompleted();
	}

	protected BackCompleted(): void
	{
		Laya.Tween.clearAll(this._sp);
		this._sp.x = -10000;
		this._sp.y = 0;
		Laya.Pool.recover(this._enemyName, this._sp);
	}

	protected BulletExcute(bulletName: string): void
	{
		let bulletSp: Laya.Sprite = BulletControl.GetInst().PopBullet(bulletName);
		let bullet: Bullet = bulletSp.getComponent(Bullet);
		bullet.Excute(bulletName, this._sp.x, this._sp.y, this._iDirection);
	}
}