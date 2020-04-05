export default class Enemy extends Laya.Script
{
	protected _enemyName: string;
	protected _sp: Laya.Sprite;
	protected _ifromX: number;
	protected _ifromY: number;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Show(info: any[]): void
	{
		this._enemyName = info[0];
		this._sp.scaleX = info[1];
		this._sp.x = this._ifromX = info[2];
		this._sp.y = this._ifromY = info[3];
		Laya.Tween.to(this._sp, {x: info[4], y: info[5]}, info[6], Laya.Ease.linearNone, Laya.Handler.create(this, this.ShowCompleted));
	}

	protected ShowCompleted(): void {}

	protected BackCompleted(): void
	{
		Laya.Pool.recover(this._enemyName, this._sp);
	}
}