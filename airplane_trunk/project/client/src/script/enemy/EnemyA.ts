import Enemy from "./Enemy";

export default class EnemyA extends Enemy
{
	protected Back(): void
	{
		Laya.Tween.to(this._sp, {x: this._iFromX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}

	protected ShowCompleted(): void
	{
		this._iBulletCount = 0;
		this._iTimes = 0;
		this.Shoot();
	}

	protected Shoot(): void
	{
		Laya.timer.loop(100, this, this._Shoot);
	}

	protected _Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletAL" : "BulletAR");
		if(++this._iBulletCount > 2)
		{
			Laya.timer.clear(this, this._Shoot);
			this._iBulletCount = 0;
			if(this._iTimes == 0)
				this.Back();
		}	
	}
}