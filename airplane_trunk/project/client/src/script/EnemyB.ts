import Enemy from "./Enemy";

export default class EnemyB extends Enemy
{
	protected ShowCompleted(): void
	{
		Laya.Pool.recover("EnemyB", this._sp);
	}
}