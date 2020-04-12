import Bullet from "./Bullet";
import PositionMgr from "../common/PositionMgr";

export default class BulletB extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		super.Excute(bulletName, fromX, fromY, direction);
		Laya.Tween.to(this._sp, {y: fromY + 100}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.DropCompleted))
	}

	private DropCompleted(): void
	{
		Laya.timer.once(1000, this, this.Shoot)
	}

	private Shoot(): void
	{
		this._bRunning = true;
	}

	onUpdate(): void
	{
		if(this._bRunning)
		{
			this._sp.x += this._iSpeed;
			if(this._sp.x > PositionMgr.RightX || this._sp.x < PositionMgr.LeftX)
				this.Stop();
		}
	}
}