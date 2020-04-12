import Enemy from "./Enemy";

export default class EnemyB extends Enemy
{
	protected ShowCompleted(): void
	{
		this._iState = 2;
		this.Shoot();
	}

	protected Shoot(): void
	{
		this._Shoot();
		Laya.timer.once(2000, this, this.Back);
	}

	protected _Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletBL" : "BulletBR");
	}

	protected Back(): void
	{
		this._iState = 3;
	}
}