import EnemyB from "./EnemyB";

export default class EnemyB2 extends EnemyB
{
	protected Shoot(): void
	{
		Laya.timer.loop(700, this, this.__Shoot);
		Laya.timer.once(2700, this, this.Back);
	}

	protected __Shoot(): void
	{
		if(++this._iTimes > 1)
		{
			Laya.timer.clear(this, this.__Shoot);
			this._iTimes = 0;
		}
		this._Shoot();
	}
}