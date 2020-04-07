import Enemy from "./Enemy";

export default class EnemyB extends Enemy
{
	protected ShowCompleted(): void
	{
		this.Shoot();
	}

	private Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletBL" : "BulletBR");
		Laya.timer.once(2000, this, this.Back);
	}

	private Back(): void
	{
		Laya.Tween.to(this._sp, {x: this._iFromX, y: this._iFromY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	}
}