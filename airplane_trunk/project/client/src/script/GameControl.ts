import Sprite = Laya.Sprite;
import Event = Laya.Event;
import ConfigData from "./data/ConfigData";
import ConfigTable from "./data/ConfigTable";
import Background from "./Background";
import MainRole from "./MainRole";
import Enemy from "./enemy/Enemy";
import PositionMgr from "./common/PositionMgr";

export default class GameControl extends Laya.Script
{
	/** @prop {name: enemyRoot, type: Node} */
	private enemyRoot: Laya.Sprite;
	/** @prop {name: explosionSp, type: Node} */
	private explosionSp: Laya.Sprite;
	/** @prop {name: startBtn, type: Node} */
	private startBtn: Laya.Button;
	/** @prop {name: restartBtn, type: Node} */
	private restartBtn: Laya.Button;
	/** @prop {name: tapSp, type: Node} */
	private tapSp: Sprite;
	/** @prop {name: mainRoleSp, type: Node} */
	private mainRoleSp: Sprite;
	/** @prop {name: backgroundSp, type: Node} */
	private backgroundSp: Sprite;
	/** @prop {name: distanceText, type:Node} */
	private distanceText: Laya.Text;

	/** @prop {name: enemyPrefAL, type: Prefab} */
	private enemyPrefAL: Laya.Prefab;
	/** @prop {name: enemyPrefBL, type: Prefab} */
	private enemyPrefBL: Laya.Prefab;
	/** @prop {name: enemyPrefCL, type: Prefab} */
	private enemyPrefCL: Laya.Prefab;
	/** @prop {name: enemyPrefZL, type: Prefab} */
	private enemyPrefZL: Laya.Prefab;
	/** @prop {name: enemyPrefZR, type: Prefab} */
	private enemyPrefZR: Laya.Prefab;

	private mainRole: MainRole;
	private background: Background;
	private explosionAni: Laya.Animation;

	private _iSpeed: number = 0;
	private _bRunning: boolean = false;
	private _iDistance: number = 0;
	private _t: number = 0;
	private _enmeyTbl: ConfigTable;
	private _enemyDict: { [key: string]: Laya.Prefab; };

	private _startTime: number;
	private _clickArr: number[];
	private _clickIndex: number;
	private _bAuto: boolean;

	constructor() { super(); }

	onAwake(): void
	{
		this.startBtn.visible = false;
		this.restartBtn.visible = false;
		this._enemyDict = {};
		this._enemyDict["EnemyAL"] = this.enemyPrefAL;
		this._enemyDict["EnemyBL"] = this.enemyPrefBL;
		this._enemyDict["EnemyCL"] = this.enemyPrefCL;
		this._enemyDict["EnemyZL"] = this.enemyPrefZL;
		this._enemyDict["EnemyZR"] = this.enemyPrefZR;

		Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);

		this._bAuto = false;
		if(this._bAuto)
		{
			this._clickIndex = 0;
			this.setAutoClick();
		}
	}

	private setAutoClick(): void
	{
		this._clickArr =
		[
			984,
			2206,
			3165,
			3793,
			4848,
			6100,
			6995,
			7508,
			8130,
			9594,
			10962
		];
	}

	private OnConfigComplete(buff: ArrayBuffer): void
	{
		ConfigData.ParseConfig(buff);
		this._enmeyTbl = ConfigData.GetTable("Enemy_Client");

		this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
		this.restartBtn.clickHandler = new Laya.Handler(this, this.onRestartBtnClick);
		this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
		this.mainRole = this.mainRoleSp.getComponent(MainRole);
		this.background = this.backgroundSp.getComponent(Background);
		
		this.explosionSp.x = -10000;
		this.explosionAni = new Laya.Animation();
		this.explosionAni.loadAtlas("res/atlas/explosion.atlas",Laya.Handler.create(this,this.ExplosionLoaded));
	}

	private ExplosionLoaded(): void
	{
		this.explosionSp.addChild(this.explosionAni);
		this.explosionSp.scaleX = 2;
		this.explosionSp.scaleY = 2;
		this.explosionAni.interval = 100;
		this.startBtn.visible = true;
		this.mainRole.Init(new Laya.Handler(this, this.Stop), this.explosionSp, this.explosionAni);
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

			if(this._bAuto)
			{
				if((new Date().getTime() - this._startTime) >= this._clickArr[this._clickIndex] + 300)
				{
					this.mainRole.Up();
					++this._clickIndex;
				}
			}	
		}
	}

	private Init(): void
	{
		this.mainRole.Reset();
		this._iDistance = 0;
		this._iSpeed = 5;
		this.mainRole.RigidBodyEnable(true);
		this.background.SetSpeed(this._iSpeed);
		this._bRunning = true;
	}

	public Stop(): void
	{
		this._bRunning = false;
		Laya.timer.once(2000, this, this.ShowRestartBtn);
	}

	private ShowRestartBtn(): void
	{
		this.restartBtn.visible = true;
	}

	private onStartBtnClick(): void
	{
		this.startBtn.visible = false;
		this.Init();
		this._startTime = new Date().getTime();
	}

	private onRestartBtnClick(): void
	{
		this.restartBtn.visible = false;
		this.Init();
	}

	private tapSpMouseHandler(e: Event): void
	{
		if(!this._bRunning)
			return;

		switch (e.type)
		{
			case Event.MOUSE_DOWN:
				let t2: Date = new Date();
				console.log(t2.getTime() - this._startTime);
				this.mainRole.Up();
				break;
		}
	}

	private _curGroupDis: number = 0;
	private _curGroupTbl: ConfigTable = null;

	private ShowEnemy(): void
	{
		if(this._iDistance % 800 == 0)
			this.ShowEnemyZ();

		let key: string = this._iDistance.toString();
		if(this._enmeyTbl.HasRow(key))
		{
			let group: string = this._enmeyTbl.GetValue(key, "Group");
			this._curGroupTbl = ConfigData.GetTable(group);
			this._curGroupDis = this._iDistance;
		}

		if(this._curGroupDis != 0)
		{
			let groupKey: string = (this._iDistance - this._curGroupDis).toString(); 
			if(this._curGroupTbl.HasRow(groupKey))
			{
				let jsonStr: string = this._curGroupTbl.GetValue(groupKey, "Enemy");
				let arr: any[] = JSON.parse(jsonStr);
				let sp: Laya.Sprite;
				let enemyName: string;
				let enemy: Enemy;
				for(let i: number = 0; i < arr.length; ++i)
				{	
					enemyName = arr[i][0];
					sp = Laya.Pool.getItemByCreateFun(enemyName, this._enemyDict[enemyName].create, this._enemyDict[enemyName]);	
					this.enemyRoot.addChild(sp);
					enemy = sp.getComponent(Enemy);
					enemy.Show(arr[i]);
				}
			}
		}
	}

	private ShowEnemyZ(): void
	{
		let enemyName: string = "EnemyZR";
		let sp = Laya.Pool.getItemByCreateFun(enemyName, this._enemyDict[enemyName].create, this._enemyDict[enemyName]);	
		this.enemyRoot.addChild(sp);
		let enemy: Enemy = sp.getComponent(Enemy);
		enemy.Show([enemyName, -1, 0, PositionMgr.LeftX, 3000]);
	}
}