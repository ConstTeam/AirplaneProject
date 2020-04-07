import Enemy from "./Enemy";

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
		Laya.timer.loop(800, this, this.Shoot);
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
		super.BulletExcute(this._iDirection == 1 ? "BulletAL" : "BulletAR");
		if(++this._iTimes2 > 2)
		{
			Laya.timer.clear(this, this._Shoot);
			this._iTimes2 = 0;
		}	
	}
}