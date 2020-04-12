import PositionMgr from "../common/PositionMgr";
import BulletControl from "../BulletControl";
import Bullet from "../bullet/Bullet";

export default class Enemy extends Laya.Script
{
	protected _enemyName: string;
	protected _sp: Laya.Sprite;
	protected _iFromX: number;
	protected _iFromY: number;
	protected _iToX: number;
	protected _iDirection: number;
	protected _iSpeed: number;
	protected _iState: number;

	protected _iBulletCount: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this._iState = 0;
		this.enabled = false;
	}

	public Show(info: any[], during: number): void
	{
		this.enabled = true;
		this._enemyName = info[0];
		this._iDirection = info[1];
		this._sp.x = this._iFromX = this._iDirection == 1 ? PositionMgr.LeftX : PositionMgr.RightX;
		this._sp.y = this._iFromY = info[2];
		this._iToX = info[3];
		this._iSpeed = this._iDirection * 10;
		this._iState = 1;
	}

	onUpdate(): void
	{
		if(this._iState == 1)
		{
			if(this._iDirection == 1)
			{
				if(this._sp.x + this._iSpeed < this._iToX)
				{
					this._sp.x += this._iSpeed;
					return;
				}
			}	
			else
			{
				if(this._sp.x + this._iSpeed > this._iToX)
				{
					this._sp.x += this._iSpeed;
					return;
				}
			}
			this._sp.x = this._iToX;
			this.ShowCompleted();
		}
		else if(this._iState == 3)
		{
			this.BackUpdate();
		}
	}

	protected BackUpdate(): void
	{
		this._sp.x -= this._iSpeed
		if(this._iDirection == 1)
		{
			if(this._sp.x < this._iFromX)
				this.BackCompleted();
		}	
		else
		{
			if(this._sp.x > this._iFromX)
				this.BackCompleted();
		}
	}

	protected ShowCompleted(): void
	{
		this._iState = 2;
		this.BackCompleted();
	}

	protected BackCompleted(): void
	{
		this.enabled = false;
		this._iState = 0;
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