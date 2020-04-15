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
	/** @prop {name: waveText, type:Node} */
	private waveText: Laya.Text;
	/** @prop {name: distanceText, type:Node} */
	private distanceText: Laya.Text;
	/** @prop {name: bottomSp, type: Node} */
	private bottomSp: Sprite;
	/** @prop {name: bottomSp2, type: Node} */
	private bottomSp2: Sprite;

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
	/** @prop {name: continueText, type: Node} */
	private continueText: Laya.Label;
	/** @prop {name: rankXBtn, type: Node} */
	private rankXBtn: Laya.Button;
	/** @prop {name: shareBtn, type: Node} */
	private shareBtn: Laya.Button;
	
	//--Enemy------------------------------------------------------------
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
	/** @prop {name: coin, type: Prefab} */
	private coin: Laya.Prefab;
	/** @prop {name: life, type: Prefab} */
	private life: Laya.Prefab;

	//--HP---------------------------------------------------------------
	/** @prop {name: hp1, type: Node} */
	private hp1: Laya.Sprite;
	/** @prop {name: hp2, type: Node} */
	private hp2: Laya.Sprite;
	/** @prop {name: hp3, type: Node} */
	private hp3: Laya.Sprite;
	/** @prop {name: coin1, type: Node} */
	private coin1: Laya.Sprite;
	/** @prop {name: coin2, type: Node} */
	private coin2: Laya.Sprite;
	/** @prop {name: coin3, type: Node} */
	private coin3: Laya.Sprite;
	//-------------------------------------------------------------------

	private mainRole: MainRole;
	private background: Background;
	private explosionAni: Laya.Animation;

	private _iSpeed: number = 0;
	private _bRunning: boolean = false;
	private _iWave: number = 0;
	private _iDistance: number = 0;
	private _enemyTbl: ConfigTable;
	private _enemyDict: { [key: string]: Laya.Prefab; };
	private _hpArr: Laya.Sprite[];
	private _coinArr: Laya.Sprite[];

	private _iHighestScore: number;
	private _scoreKey: string;
	private _iCoin: number = 0;
	private _iHp: number = 0;

	constructor() { super(); }

	onAwake(): void
	{
		this._scoreKey = "airplaneScore"
		this.startBtn.visible = false;
		this.resultPanel.visible = false;
		this.rankPanel.visible = false;
		this.openDataViewer.visible = false;
		this._enemyDict = {};
		this._enemyDict["EnemyAL1"] = this.enemyPrefAL1;
		this._enemyDict["EnemyAL2"] = this.enemyPrefAL2;
		this._enemyDict["EnemyBL1"] = this.enemyPrefBL1;
		this._enemyDict["EnemyBL2"] = this.enemyPrefBL2;
		this._enemyDict["EnemyCL1"] = this.enemyPrefCL1;
		this._enemyDict["EnemyCL2"] = this.enemyPrefCL2;
		this._enemyDict["EnemyZL"] = this.enemyPrefZL;
		this._enemyDict["EnemyZR"] = this.enemyPrefZR;
		this._enemyDict["Coin"] = this.coin;
		this._enemyDict["Life"] = this.life;

		this._hpArr = [this.hp1, this.hp2, this.hp3];
		this._coinArr = [this.coin1, this.coin2, this.coin3];
		this.SetCoin(0);
		this.SetHp(0);

		Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);
	}

	private OnConfigComplete(buff: ArrayBuffer): void
	{
		ConfigData.ParseConfig(buff);
		this._enemyTbl = ConfigData.GetTable("Enemy_Client");

		this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
		this.restartBtn.clickHandler = new Laya.Handler(this, this.onRestartBtnClick);
		this.continueBtn.clickHandler = new Laya.Handler(this, this.onContinueBtnClick);
		this.rankBtn.clickHandler = new Laya.Handler(this, this.onRankBtnClick);
		this.rankXBtn.clickHandler = new Laya.Handler(this, this.onRankXBtnClick);
		this.shareBtn.clickHandler = new Laya.Handler(this, this.onShareBtnClick);
		this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
		this.mainRole = this.mainRoleSp.getComponent(MainRole);
		this.background = this.backgroundSp.getComponent(Background);

		let score: string = Laya.LocalStorage.getItem("score");
		this._iHighestScore = score == null ? 0 : Number(Laya.LocalStorage.getItem("score"));

		Laya.loader.load(["res/atlas/common.atlas"], Laya.Handler.create(this, () => { Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/common.atlas"); }));
		
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
		this.mainRole.SetInfo(new Laya.Handler(this, this.SetCoin), new Laya.Handler(this, this.SetHp), new Laya.Handler(this, this.Stop), this.explosionSp, this.explosionAni, this.bottomSp, this.bottomSp2);
	}

	onUpdate(): void
	{
		if(this._bRunning)
		{
			this._iDistance += this._iSpeed;
			this.distanceText.text = ((this._iDistance / 1000).toFixed(1)).toString();
			this.background.Update();
			this.ShowEnemy();
		}
	}

	private Start(): void
	{
		this._iCoin = 0;
		this._iHp = 0;	
		this._iSpeed = 5;
		this.mainRole.Reset();
		this.mainRole.RigidBodyEnable(true);
		this.background.SetSpeed(this._iSpeed);
		this._bRunning = true;
		Laya.SoundManager.playMusic("sound/bgm.mp3", 0);
	}

	private Continue(): void
	{
		this.mainRole.Continue();
		this.mainRole.RigidBodyEnable(true);
		this._bRunning = true;
		Laya.SoundManager.playMusic("sound/bgm.mp3", 0);
	}

	public Stop(): void
	{
		Laya.SoundManager.stopMusic();
		this._bRunning = false;
		Laya.timer.once(2000, this, this.ShowResultPanel);

		if(this._iDistance > this._iHighestScore)
		{
			this._iHighestScore = this._iDistance;
			Laya.LocalStorage.setItem("score", this._iHighestScore.toString());
			this.SetUserCloudStorage((this._iHighestScore / 1000).toFixed(1).toString());
		}
	}

	private SetCoin(v: number): void
	{
		this._iCoin = v
		for(let i: number = 0; i < 3; ++i)
			this._coinArr[i].visible = i < v;
	}

	private SetHp(v: number): void
	{
		this._iHp = v;
		for(let i: number = 0; i < 3; ++i)
			this._hpArr[i].visible = i < v;
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
		this.curText.text = (this._iDistance / 1000).toFixed(1).toString();
		this.maxText.text = (Number(Laya.LocalStorage.getItem("score")) / 1000).toFixed(1).toString();
		this.continueText.text = this.waveText.text;
		this.continueBtn.gray = this._iCoin <= 0;
	}

	private onStartBtnClick(): void
	{
		this.startBtn.visible = false;
		this.waveText.text = "0";
		this._iDistance = 0;
		this.Start();
	}

	private onRestartBtnClick(): void
	{
		this.resultPanel.visible = false;
		this.ShowRankPanel(false);

		this.SetCoin(0);
		this.waveText.text = "0";
		this._iDistance = 0;
		this.Start();
		this.mainRole.SetInvincible();
	}

	private onContinueBtnClick(): void
	{
		if(this._iCoin <= 0)
			return;
		
		this.resultPanel.visible = false;
		this.ShowRankPanel(false);

		this.SetCoin(--this._iCoin);
		this._iDistance = Number(this._sCurWaveDis);
		this.Continue();
		this.mainRole.SetInvincible();
	}

	private onRankBtnClick(): void
	{
		this.ShowRankPanel(true);
	}

	private onRankXBtnClick(): void
	{
		this.ShowRankPanel(false);
	}

	private onShareBtnClick(): void
	{

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

	private _sCurWaveDis: string = "";
	private _curGroupDis: number = 0;
	private _curGroupTbl: ConfigTable = null;

	private ShowEnemy(): void
	{
		if(this._iDistance % 800 == 0)
			this.ShowEnemyZ();

		let key: string = this._iDistance.toString();
		if(this._enemyTbl.HasRow(key))
		{
			let wave: string = this._enemyTbl.GetValue(key, "Wave");
			if(wave != "")
			{
				this.waveText.text = wave;
				Laya.Tween.from(this.waveText, {scaleX: 2, scaleY: 2}, 500, Laya.Ease.backOut);
			}
				
			this._sCurWaveDis = key;
			let group: string = this._enemyTbl.GetValue(key, "Group");
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
					if(enemyName == "Life")
					{
						if(this._iCoin < 3)
							enemyName = "Coin";
						else if(this._iHp > 2)
							continue;
					}

					sp = Laya.Pool.getItemByCreateFun(enemyName, this._enemyDict[enemyName].create, this._enemyDict[enemyName]);	
					this.enemyRoot.addChild(sp);
					enemy = sp.getComponent(Enemy);
					enemy.Show(arr[i], 1000);
				}
			}
		}
	}

	private _enemyZName: string = "EnemyZR";
	private _enemyZInfo: any[] = [this._enemyZName, -1, 0, PositionMgr.LeftX];
	private ShowEnemyZ(): void
	{
		let sp = Laya.Pool.getItemByCreateFun(this._enemyZName, this._enemyDict[this._enemyZName].create, this._enemyDict[this._enemyZName]);	
		this.enemyRoot.addChild(sp);
		let enemy: Enemy = sp.getComponent(Enemy);
		enemy.Show(this._enemyZInfo, 3000);
	}
}