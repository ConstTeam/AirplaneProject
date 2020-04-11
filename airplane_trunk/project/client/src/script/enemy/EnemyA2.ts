import EnemyA from "./EnemyA";

export default class EnemyA2 extends EnemyA
{
	protected Shoot(): void
	{
		this.__Shoot();
		Laya.timer.once(700, this, this.__Shoot);
		Laya.timer.once(1200, this, this.Back);
	}

	protected __Shoot(): void
	{
		Laya.timer.loop(150, this, this._Shoot);
	}
}