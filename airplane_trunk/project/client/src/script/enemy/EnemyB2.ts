import EnemyB from "./EnemyB";

export default class EnemyB2 extends EnemyB
{
	protected Shoot(): void
	{
		this._Shoot();
		Laya.timer.once(700, this, this._Shoot);
		Laya.timer.once(2700, this, this.Back);
	}
}