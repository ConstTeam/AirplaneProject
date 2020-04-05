import Enemy from "./Enemy";

export default class EnemyC extends Enemy
{
	protected ShowCompleted(): void
	{
		this.BackCompleted();
	}
}