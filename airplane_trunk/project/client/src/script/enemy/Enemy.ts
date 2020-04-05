import PositionMgr from "../common/PositionMgr";

export default class Enemy extends Laya.Script
{
	protected _enemyName: string;
	protected _sp: Laya.Sprite;
	protected _iFromX: number;
	protected _iFromY: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Show(info: any[]): void
	{
		this._enemyName = info[0];
		this._sp.scaleX = info[1];
		this._sp.x = this._iFromX = this._sp.scaleX == 1 ? PositionMgr.LeftX : PositionMgr.RightX;
		this._sp.y = this._iFromY = info[2];
		Laya.Tween.to(this._sp, {x: info[3]}, info[4], Laya.Ease.linearNone, Laya.Handler.create(this, this.ShowCompleted));
	}

	protected ShowCompleted(): void {}

	protected BackCompleted(): void
	{
		Laya.Tween.clearAll(this._sp);
		this._sp.x = -10000;
		this._sp.y = 0;
		Laya.Pool.recover(this._enemyName, this._sp);
	}
}