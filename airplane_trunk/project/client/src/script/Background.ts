import Sprite = Laya.Sprite;

export default class Background extends Laya.Script
{
	/** @prop {name: ground1, type:Node} */
	private ground1: Sprite;
	/** @prop {name: ground2, type:Node} */
	private ground2: Sprite;
	/** @prop {name: ground3, type:Node} */
	private ground3: Sprite;

	/** @prop {name: mountains1, type:Node} */
	private mountains1: Sprite;
	/** @prop {name: mountains2, type:Node} */
	private mountains2: Sprite;
	/** @prop {name: mountains3, type:Node} */
	private mountains3: Sprite;
	
	/** @prop {name: cloud1, type:Node} */
	private cloud1: Sprite;
	/** @prop {name: cloud2, type:Node} */
	private cloud2: Sprite;
	/** @prop {name: cloud3, type:Node} */
	private cloud3: Sprite;

	private _iSpeed: number;
	private _iSpeed2: number;
	private _iSpeed3: number;

	constructor() { super(); }

	public SetSpeed(speed: number): void
	{
		this._iSpeed = speed;
		this._iSpeed2 = speed / 5;
		this._iSpeed3 = speed / 25;
	}

	public Update(): void
	{
		this.ground1.x -= this._iSpeed;
		this.ground2.x -= this._iSpeed;
		this.ground3.x -= this._iSpeed;
		if(this.ground1.x <= -2040)
			this.ground1.x = 2460;
		else if(this.ground2.x <= -2040)
			this.ground2.x = 2460;
		else if(this.ground3.x <= -2040)
			this.ground3.x = 2460;

		this.mountains1.x -= this._iSpeed2;
		this.mountains2.x -= this._iSpeed2;
		this.mountains3.x -= this._iSpeed2;
		if(this.mountains1.x <= -3136)
			this.mountains1.x = 3008;
		else if(this.mountains2.x <= -3136)
			this.mountains2.x = 3008;
		else if(this.mountains3.x <= -3136)
			this.mountains3.x = 3008;

		this.cloud1.x -= this._iSpeed3;
		this.cloud2.x -= this._iSpeed3;
		this.cloud3.x -= this._iSpeed3;
		if(this.cloud1.x <= -3436)
			this.cloud1.x = 3158;
		else if(this.cloud2.x <= -3436)
			this.cloud2.x = 3158;
		else if(this.cloud3.x <= -3436)
			this.cloud3.x = 3158;
	}
}