import Enemy from "./Enemy";

export default class EnemyA extends Enemy
{
	protected ShowCompleted(): void
	{
		this._iState = 2;
		this._iBulletCount = 0;
		this.Shoot();
	}

	protected Shoot(): void
	{
		Laya.timer.loop(150, this, this._Shoot, [true]);
		Laya.timer.once(500, this, this.Back);
	}

	protected Back(): void
	{
		this._iState = 3;
	}

	protected _Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletAL" : "BulletAR");
		if(++this._iBulletCount > 2)
		{
			Laya.timer.clear(this, this._Shoot);
			this._iBulletCount = 0;	
		}	
	}
}