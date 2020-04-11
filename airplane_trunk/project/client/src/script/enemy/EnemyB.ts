import Enemy from "./Enemy";

export default class EnemyB extends Enemy
{
	protected ShowCompleted(): void
	{
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
		Laya.Tween.to(this._sp, {x: this._iFromX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}
}