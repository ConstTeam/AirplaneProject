import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Background from "./Background"
import MainRole from "./MainRole"
import EnemyA from "./EnemyA"
import ConfigData from "./data/ConfigData";
import ConfigTable from "./data/ConfigTable";

export default class GameControl extends Laya.Script
{
	/** @prop {name: sceneRoot, type: Node} */
	private sceneRoot: Laya.Sprite;
	/** @prop {name: enemyRoot, type: Node} */
	private enemyRoot: Laya.Sprite;
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
	private _enmeyTbl: ConfigTable;

	constructor() { super(); }

	onAwake(): void
	{
		Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);
	}

	private OnConfigComplete(buff: ArrayBuffer): void
	{
		ConfigData.ParseConfig(buff);
		this._enmeyTbl = ConfigData.GetTable("Enemy_Client");

		this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
		this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
		this.mainRole = this.mainRoleSp.getComponent(MainRole);
		this.background = this.backgroundSp.getComponent(Background);

		this.mainRole.Init(new Laya.Handler(this, this.Stop));
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
				this.ShowEnemy();
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

	public Stop(): void
	{
		this._bRunning = false;
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

	private ShowEnemy(): void
	{
		let key: string = this._iDistance.toString();
		if(this._enmeyTbl.HasRow(key))
		{
			let jsonStr: string = this._enmeyTbl.GetValue(key, "Enemy");
			let arr: any[] = JSON.parse(jsonStr);
			for(let i: number = 0; i < arr.length; ++i)
			{
				let enemyASp: Laya.Sprite = Laya.Pool.getItemByCreateFun("enemyA", this.enemyPrefabA.create, this.enemyPrefabA) as Laya.Sprite;
				this.enemyRoot.addChild(enemyASp);
				let enemyA: EnemyA = enemyASp.getComponent(EnemyA);
				enemyA.Move(arr[i][1] as number, arr[i][2] as number, arr[i][3] as number, arr[i][4] as number);
			}
		}
	}
}