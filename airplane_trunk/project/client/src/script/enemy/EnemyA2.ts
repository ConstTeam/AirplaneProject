import EnemyA from "./EnemyA";

export default class EnemyA2 extends EnemyA
{
	protected Shoot(): void
	{
		Laya.timer.loop(800, this, this.__Shoot);
	}

	protected __Shoot(): void
	{
		if(++this._iTimes > 1)
		{
			Laya.timer.clear(this, this.__Shoot);
			this._iTimes = 0;
		}
		Laya.timer.loop(100, this, this._Shoot);
	}
}