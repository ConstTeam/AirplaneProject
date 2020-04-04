export default class Enemy extends Laya.Script
{
	protected _sp: Laya.Sprite;
	protected _ifromX: number;
	protected _ifromY: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Show(scaleX: number, fromX:number, fromY:number, toX: number, toY: number, during: number): void
	{
		this._sp.scaleX = scaleX;
		this._sp.x = this._ifromX = fromX;
		this._sp.y = this._ifromY = fromY;
		Laya.Tween.to(this._sp, {x: toX, y: toY}, during, Laya.Ease.linearNone, Laya.Handler.create(this, this.ShowCompleted));
	}

	protected ShowCompleted(): void {}
}