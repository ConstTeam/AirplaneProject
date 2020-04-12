import Bullet from "./Bullet";
import PositionMgr from "../common/PositionMgr";

export default class BulletA extends Bullet
{
	constructor() { super(); }

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		super.Excute(bulletName, fromX, fromY, direction);
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