import BulletControl from "./BulletControl";
import BulletA from "./BulletA";

export default class EnemyA extends Laya.Script
{
	private _sp: Laya.Sprite;

	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Move(fromX:number, fromY:number, toX: number, toY: number): void
	{
		this._sp.x = fromX;
		this._sp.y = fromY;
		Laya.Tween.to(this._sp, {x: toX, y: toY}, 3000, Laya.Ease.linearNone, Laya.Handler.create(this, this.MoveCompleted));
	}

	private MoveCompleted(): void
	{
		let bulletSp: Laya.Sprite = BulletControl.GetInst().PopBulletA();
		let bullet: BulletA = bulletSp.getComponent(BulletA) as BulletA;
		bullet.Excute(this._sp.x + 153, this._sp.y + 61, 10);
	}
}