import Sprite = Laya.Sprite;
import Event = Laya.Event;

export default class GameControl extends Laya.Script
{
	/** @prop {name: tapSp, tips:"点击区域", type:Node} */
	private tapSp: Laya.Sprite;

	constructor()
	{
		super();
	}

	onAwake(): void
	{
		this.tapSp.on(Event.MOUSE_DOWN, this, this.mouseHandler);
	}

	private mouseHandler(e: Event): void
	{
		switch (e.type)
		{
			case Event.MOUSE_DOWN:
				console.log("MOUSE_DOWN");
				break;
		}
	}
}