import PositionMgr from "../common/PositionMgr";

export default class Bullet extends Laya.Script
{
	protected _bulletName: string
	protected _iDirection: number;
	protected _sp: Laya.Sprite;
	protected _bRunning: boolean;
	protected _iSpeed: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this._bRunning = false;
		this.enabled = false;
	}

	public Excute(bulletName: string, fromX: number, fromY: number, direction: number): void
	{
		this.enabled = true;
		this._bRunning = false;
		this._bulletName = bulletName;
		this._iDirection = direction;
		this._sp.x = fromX;
		this._sp.y = fromY;
		this._iSpeed = direction * 10;
	}

	public Stop(): void
	{
		Laya.Tween.clearAll(this._sp);
		this._bRunning = false;
		this.enabled = false;
		this._sp.x = -10000;
		this._sp.y = 0;
		Laya.Pool.recover(this._bulletName, this._sp);
	}
}