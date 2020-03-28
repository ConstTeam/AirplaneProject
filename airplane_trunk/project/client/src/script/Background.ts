import Sprite = Laya.Sprite;

export default class Background extends Laya.Script
{
	/** @prop {name: bg1, type:Node} */
	private bg1: Sprite;
	/** @prop {name: bg2, type:Node} */
	private bg2: Sprite;

	private _bRunning: boolean = false;

	constructor() { super(); }

	onUpdate(): void
	{
		if(this._bRunning)
		{
			this.bg1.x -= 5;
			this.bg2.x -= 5;
		}
	}

	public Play(): void
	{
		this._bRunning = true;
	}
}