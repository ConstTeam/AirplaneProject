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
	/** @prop {name: tapSp, type: Node} */
	private tapSp: Sprite;
	/** @prop {name: mainRoleSp, type: Node} */
	private mainRoleSp: Sprite;
	/** @prop {name: backgroundSp, type: Node} */
	private backgroundSp: Sprite;
	/** @prop {name: distanceText, type:Node} */
	private distanceText: Laya.Text;

	//--ResultPanel--------------------------------------------------
	/** @prop {name: resultPanel, type: Node} */
	private resultPanel: Laya.Panel;
	/** @prop {name: restartBtn, type: Node} */
	private restartBtn: Laya.Button;
	/** @prop {name: continueBtn, type: Node} */
	private continueBtn: Laya.Button;
	/** @prop {name: rankPanel, type: Node} */
	private rankPanel: Laya.Sprite;
	/** @prop {name: rankBtn, type: Node} */
	private rankBtn: Laya.Button;
	/** @prop {name: openDataViewer, type: Node} */
	private openDataViewer: Laya.WXOpenDataViewer;
	/** @prop {name: curText, type: Node} */
	private curText: Laya.Label;
	/** @prop {name: maxText, type: Node} */
	private maxText: Laya.Label;
	
	//---------------------------------------------------------------

	/** @prop {name: enemyPrefAL1, type: Prefab} */
	private enemyPrefAL1: Laya.Prefab;
	/** @prop {name: enemyPrefAL2, type: Prefab} */
	private enemyPrefAL2: Laya.Prefab;
	/** @prop {name: enemyPrefBL1, type: Prefab} */
	private enemyPrefBL1: Laya.Prefab;
	/** @prop {name: enemyPrefBL2, type: Prefab} */
	private enemyPrefBL2: Laya.Prefab;
	/** @prop {name: enemyPrefCL1, type: Prefab} */
	private enemyPrefCL1: Laya.Prefab;
	/** @prop {name: enemyPrefCL2, type: Prefab} */
	private enemyPrefCL2: Laya.Prefab;
	
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

	private _iHighestScore: number;
	private _scoreKey: string;

	constructor() { super(); }

	onAwake(): void
	{
		this._scoreKey = "airplaneScore"
		this.startBtn.visible = false;
		this.resultPanel.visible = false;
		this.rankPanel.visible = false;
		this.openDataViewer.visible = false;
		//this.continueBtn.visible = false;
		this._enemyDict = {};
		this._enemyDict["EnemyAL1"] = this.enemyPrefAL1;
		this._enemyDict["EnemyAL2"] = this.enemyPrefAL2;
		this._enemyDict["EnemyBL1"] = this.enemyPrefBL1;
		this._enemyDict["EnemyBL2"] = this.enemyPrefBL2;
		this._enemyDict["EnemyCL1"] = this.enemyPrefCL1;
		this._enemyDict["EnemyCL2"] = this.enemyPrefCL2;
		this._enemyDict["EnemyZL"] = this.enemyPrefZL;
		this._enemyDict["EnemyZR"] = this.enemyPrefZR;

		Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);
	}

	private OnConfigComplete(buff: ArrayBuffer): void
	{
		ConfigData.ParseConfig(buff);
		this._enmeyTbl = ConfigData.GetTable("Enemy_Client");

		this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
		this.restartBtn.clickHandler = new Laya.Handler(this, this.onRestartBtnClick);
		this.continueBtn.clickHandler = new Laya.Handler(this, this.onContinueBtnClick);
		this.rankBtn.clickHandler = new Laya.Handler(this, this.onRankBtnClick);
		this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
		this.mainRole = this.mainRoleSp.getComponent(MainRole);
		this.background = this.backgroundSp.getComponent(Background);

		let score: string = Laya.LocalStorage.getItem("score");
		this._iHighestScore = score == null ? 0 : Number(Laya.LocalStorage.getItem("score"));

		Laya.loader.load(["res/atlas/rank.atlas"], Laya.Handler.create(this, () => { Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas"); }));
		
		this.explosionSp.x = -10000;
		this.explosionAni = new Laya.Animation();
		this.explosionAni.loadAtlas("res/atlas/explosion.atlas", Laya.Handler.create(this,this.ExplosionLoaded));
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
		}
	}

	private Init(): void
	{
		this.mainRole.Reset();
		this._iSpeed = 5;
		this.mainRole.RigidBodyEnable(true);
		this.background.SetSpeed(this._iSpeed);
		this._bRunning = true;
		Laya.SoundManager.playMusic("sound/bgm.mp3", 0);
	}

	public Stop(): void
	{
		Laya.SoundManager.stopMusic();
		this._bRunning = false;
		Laya.timer.once(2000, this, this.ShowResultPanel);

		let score: number = this._iDistance / 100;
		if(score > this._iHighestScore)
		{
			this._iHighestScore = score;
			Laya.LocalStorage.setItem("score", score.toString());
			this.SetUserCloudStorage(score.toString());
		}
	}

	private SetUserCloudStorage(data:String): void
	{
		var kvDataList = [];
		var obj: any = {};
		obj.wxgame = {};
		obj.wxgame.score = data;
		obj.wxgame.update_time = Laya.Browser.now();
		kvDataList.push({"key": this._scoreKey, "value": JSON.stringify(obj)});
		wx.setUserCloudStorage({
			KVDataList:kvDataList,
			success:function(e):void{
				console.log('-----success:' + JSON.stringify(e));
			},
			fail:function(e):void{
				console.log('-----fail:' + JSON.stringify(e));
			},
			complete:function(e):void{
				console.log('-----complete:' + JSON.stringify(e));
			}
		});
	}

	private ShowResultPanel(): void
	{
		this.resultPanel.visible = true;
		this.curText.text = (this._iDistance / 100).toString();
		this.maxText.text = Laya.LocalStorage.getItem("score");
	}

	private onStartBtnClick(): void
	{
		this.startBtn.visible = false;
		this._iDistance = 0;
		this.Init();
	}

	private onRestartBtnClick(): void
	{
		this.resultPanel.visible = false;
		this.ShowRankPanel(false);
		this._iDistance = 0;
		this.Init();
		this.mainRole.SetInvincible();
	}

	private onContinueBtnClick(): void
	{
		this.resultPanel.visible = false;
		this.ShowRankPanel(false);
		this.Init();
		this.mainRole.SetInvincible();
	}

	private onRankBtnClick(): void
	{
		this.ShowRankPanel(!this.rankPanel.visible);
	}

	private ShowRankPanel(bShow: boolean): void
	{
		this.rankPanel.visible = bShow;
		this.openDataViewer.visible = bShow;
		if(bShow)
			this.openDataViewer.postMsg({ type: "RankOpen"});
		else
			this.openDataViewer.postMsg({ type: "RankClose"});
	}

	private tapSpMouseHandler(e: Event): void
	{
		if(!this._bRunning)
			return;

		switch (e.type)
		{
			case Event.MOUSE_DOWN:
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