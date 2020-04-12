import Enemy from "./Enemy";
import PositionMgr from "../common/PositionMgr";

export default class EnemyC extends Enemy
{
	protected ShowCompleted(): void
	{
		this._iState = 2;
		this.Shoot();
	}

	protected Shoot(): void
	{
		this._Shoot();
		this.Back();
	}

	protected _Shoot(): void
	{
		super.BulletExcute(this._iDirection == 1 ? "BulletCL" : "BulletCR");
	}

	protected Back(): void
	{
		this._iState = 3;
	}

	protected BackUpdate(): void
	{
		this._sp.x += this._iSpeed
		if(this._iDirection == 1)
		{
			if(this._sp.x > PositionMgr.RightX)
				this.BackCompleted();
		}	
		else
		{
			if(this._sp.x < PositionMgr.LeftX)
				this.BackCompleted();
		}
	}
}