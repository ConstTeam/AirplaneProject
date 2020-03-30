import Sprite = Laya.Sprite;

export default class Background extends Laya.Script
{
	/** @prop {name: bg1, type:Node} */
	private bg1: Sprite;
	/** @prop {name: bg2, type:Node} */
	private bg2: Sprite;

	private _iSpeed: number;

	constructor() { super(); }

	public SetSpeed(speed: number): void
	{
		this._iSpeed = speed;
	}

	public Update(): void
	{
		this.bg1.x -= this._iSpeed;
		this.bg2.x -= this._iSpeed;
		if(this.bg1.x <= -2560)
			this.bg1.x = 2560;
		else if(this.bg2.x <= -2560)
			this.bg2.x = 2560;
	}
}