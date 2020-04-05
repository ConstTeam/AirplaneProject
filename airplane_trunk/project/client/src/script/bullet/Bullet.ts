export default class Bullet extends Laya.Script
{
	protected _bulletName: string
	protected _sp: Laya.Sprite;

	constructor() { super(); }
	
	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
	}

	public Excute(bulletName: string, fromX: number, fromY: number): void
	{
		this._bulletName = bulletName;
		this._sp.x = fromX;
		this._sp.y = fromY;
	}

	public Stop(): void
	{
		Laya.Tween.clearAll(this._sp);
		this._sp.x = -10000;
		this._sp.y = 0;
		Laya.Pool.recover(this._bulletName, this._sp);
	}
}