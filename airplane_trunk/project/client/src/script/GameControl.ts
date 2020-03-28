import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Background from "./Background"

export default class GameControl extends Laya.Script
{
	/** @prop {name: tapSp, type:Node} */
	private tapSp: Sprite;
	/** @prop {name: mainRoleSp, type:Node} */
	private mainRoleSp: Sprite;
	/** @prop {name: backgroundSp, type:Node} */
	private backgroundSp: Sprite;

	private mainRoleRigid: Laya.RigidBody;
	private background: Background;

	constructor() { super(); }

	onAwake(): void
	{
		this.tapSp.on(Event.MOUSE_DOWN, this, this.mouseHandler);
		this.mainRoleRigid = this.mainRoleSp.getComponent(Laya.RigidBody);
		this.background = this.backgroundSp.getComponent(Background);
		this.background.Play();
	}

	private mouseHandler(e: Event): void
	{
		switch (e.type)
		{
			case Event.MOUSE_DOWN:
				this.mainRoleRigid.setVelocity({x: 0, y: -10});
				break;
		}
	}
}