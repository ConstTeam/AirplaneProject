import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Background from "./Background"
import MainRole from "./MainRole"

export default class GameControl extends Laya.Script
{
	/** @prop {name: startBtn, type: Node} */
	private startBtn: Laya.Button;
	/** @prop {name: tapSp, type: Node} */
	private tapSp: Sprite;
	/** @prop {name: mainRoleSp, type: Node} */
	private mainRoleSp: Sprite;
	/** @prop {name: backgroundSp, type: Node} */
	private backgroundSp: Sprite;
	/** @prop {name: distanceText, type:Node} */
	private distanceText: Laya.Text;
	/** @prop {name: enemyPrefabA, type: Prefab} */
	private enemyPrefabA: Laya.Prefab;

	private mainRole: MainRole;
	private background: Background;

	private _iSpeed: number = 0;
	private _bRunning: boolean = false;
	private _iDistance: number = 0;
	private _t: number = 0;

	constructor() { super(); }

	onAwake(): void
	{
		this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
		this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
		this.mainRole = this.mainRoleSp.getComponent(MainRole);
		this.background = this.backgroundSp.getComponent(Background);
	}

	onStart(): void
	{
		this.mainRole.Init();
	}

	onUpdate(): void
	{
		if(this._bRunning)
		{
			this.background.Update();

			this._iDistance += this._iSpeed;
			this._t += Laya.timer.delta
			if(this._t >= 1)
			{
				this.distanceText.text = (Math.floor(this._iDistance / 100)).toString();
				this._t = 0;
			}
		}
	}

	private Start(): void
	{
		this.startBtn.visible = false;
		this._iSpeed = 5;
		this.mainRole.RigidBodyEnable(true);
		this.background.SetSpeed(this._iSpeed);
		this._bRunning = true;
	}

	private onStartBtnClick(): void
	{
		this.Start();
	}

	private tapSpMouseHandler(e: Event): void
	{
		switch (e.type)
		{
			case Event.MOUSE_DOWN:
				this.mainRole.Up();
				break;
		}
	}
}