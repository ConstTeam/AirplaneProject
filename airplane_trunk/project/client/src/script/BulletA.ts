export default class BulletA extends Laya.Script
{
	private _sp: Laya.Sprite;
	private _iSpeed: number;

	onAwake(): void
	{
		this._sp = this.owner as Laya.Sprite;
		this.enabled = false;
	}

	onUpdate(): void
	{
		this._sp.x += this._iSpeed;
		if(this._sp.x >= 3000)
			this.Stop();
	}

	public Excute(x: number, y: number, speed: number): void
	{
		this._sp.x = x;
		this._sp.y = y;
		this._iSpeed = speed;
		this.enabled = true
	}

	public Stop(): void
	{
		this.enabled = false;
		Laya.Pool.recover("bulletA", this._sp);
	}
}