import EnemyC from "./EnemyC";

export default class EnemyC2 extends EnemyC
{
	protected Shoot(): void
	{
		this._Shoot();
		Laya.timer.once(500, this, this._Shoot);
		this.Back();
	}
}