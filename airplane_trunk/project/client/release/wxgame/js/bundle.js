(function () {
	'use strict';

	class Background extends Laya.Script {
	    constructor() { super(); }
	    SetSpeed(speed) {
	        this._iSpeed = speed;
	        this._iSpeed2 = speed / 5;
	        this._iSpeed3 = speed / 25;
	    }
	    Update() {
	        this.ground1.x -= this._iSpeed;
	        this.ground2.x -= this._iSpeed;
	        this.ground3.x -= this._iSpeed;
	        if (this.ground1.x <= -2040)
	            this.ground1.x = 2460;
	        else if (this.ground2.x <= -2040)
	            this.ground2.x = 2460;
	        else if (this.ground3.x <= -2040)
	            this.ground3.x = 2460;
	        this.mountains1.x -= this._iSpeed2;
	        this.mountains2.x -= this._iSpeed2;
	        this.mountains3.x -= this._iSpeed2;
	        if (this.mountains1.x <= -3136)
	            this.mountains1.x = 3008;
	        else if (this.mountains2.x <= -3136)
	            this.mountains2.x = 3008;
	        else if (this.mountains3.x <= -3136)
	            this.mountains3.x = 3008;
	        this.cloud1.x -= this._iSpeed3;
	        this.cloud2.x -= this._iSpeed3;
	        this.cloud3.x -= this._iSpeed3;
	        if (this.cloud1.x <= -3436)
	            this.cloud1.x = 3158;
	        else if (this.cloud2.x <= -3436)
	            this.cloud2.x = 3158;
	        else if (this.cloud3.x <= -3436)
	            this.cloud3.x = 3158;
	    }
	}

	class MainRole extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._sp = this.owner;
	        this._rigidbody = this.owner.getComponent(Laya.RigidBody);
	        this.Reset();
	    }
	    onTriggerEnter(other, self, contact) {
	        let otherSp = other.owner;
	        let bBottom = otherSp.name == "Bottom";
	        if (this._bInvincible && !bBottom)
	            return;
	        if (otherSp.name == "Top")
	            return;
	        this.RigidBodyEnable(false);
	        this._stopCbHandler.run();
	        this._explosionSP.x = this._sp.x;
	        this._explosionSP.y = this._sp.y;
	        this._explosionAni.play(0, false);
	        Laya.SoundManager.playSound("sound/explosion.wav");
	        Laya.timer.once(10000, this, this.HideExplosion);
	        this._sp.x = -10000;
	        if (!bBottom)
	            otherSp.destroy();
	    }
	    HideExplosion() {
	        this._explosionSP.x = -10000;
	    }
	    Init(stopCbHandler, explosionSP, expolsionAni) {
	        this._stopCbHandler = stopCbHandler;
	        this._explosionSP = explosionSP;
	        this._explosionAni = expolsionAni;
	    }
	    Reset() {
	        this._sp.x = 959;
	        this._sp.y = 539;
	        this.RigidBodyEnable(false);
	    }
	    RigidBodyEnable(bEnable) {
	        this._rigidbody.enabled = bEnable;
	    }
	    SetInvincible() {
	        this._bInvincible = true;
	        Laya.timer.loop(100, this, this.InvincibleEffect);
	        Laya.timer.once(3000, this, this.ClearInvincible);
	    }
	    InvincibleEffect() {
	        this._sp.visible = !this._sp.visible;
	    }
	    ClearInvincible() {
	        Laya.timer.clear(this, this.InvincibleEffect);
	        this._sp.visible = true;
	        this._bInvincible = false;
	    }
	    Up() {
	        Laya.SoundManager.playSound("sound/up.mp3", 1);
	        this._rigidbody.setVelocity({ x: 0, y: -12 });
	    }
	}

	class ConfigRow {
	    constructor() {
	        this._rowData = new Array();
	    }
	    SetColKeys(colKeys) {
	        this._colKeys = colKeys;
	    }
	    AddValue(value) {
	        this._rowData.push(value);
	    }
	    GetValue(colKey) {
	        var iVal;
	        iVal = this._colKeys[colKey];
	        if (iVal == null)
	            return null;
	        return this._rowData[iVal];
	    }
	}

	class ConfigTable {
	    constructor() {
	        this.m_Data = {};
	        this.m_dicColKeys = {};
	        this._iColLength = 0;
	    }
	    AddRow(rowKey, rowData) {
	        rowData.SetColKeys(this.m_dicColKeys);
	        this.m_Data[rowKey] = rowData;
	    }
	    AddColKey(colKey) {
	        this.m_dicColKeys[colKey] = this._iColLength++;
	    }
	    GetValue(rowKey, colKey) {
	        var row = this.m_Data[rowKey];
	        if (row == null)
	            return null;
	        return row.GetValue(colKey);
	    }
	    GetRow(rowKey) {
	        return this.m_Data[rowKey];
	    }
	    HasRow(rowKey) {
	        return this.m_Data[rowKey] != null;
	    }
	}

	class Util {
	    static Utf8ArrayToStr(array) {
	        var out;
	        var i, len;
	        var c;
	        var char2, char3;
	        out = "";
	        len = array.length;
	        i = 0;
	        while (i < len) {
	            c = array[i++];
	            switch (c >> 4) {
	                case 0:
	                case 1:
	                case 2:
	                case 3:
	                case 4:
	                case 5:
	                case 6:
	                case 7:
	                    out += String.fromCharCode(c);
	                    break;
	                case 12:
	                case 13:
	                    char2 = array[i++];
	                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	                    break;
	                case 14:
	                    char2 = array[i++];
	                    char3 = array[i++];
	                    out += String.fromCharCode(((c & 0x0F) << 12) |
	                        ((char2 & 0x3F) << 6) |
	                        ((char3 & 0x3F) << 0));
	                    break;
	            }
	        }
	        return out;
	    }
	}

	class EncryptTool {
	    static Decrypt(data, encryptLen, beginPos = 0) {
	        var dataLen = data.length;
	        if (dataLen < beginPos + 2)
	            return;
	        var encodeLen = dataLen > encryptLen * 2 ? encryptLen : (dataLen - beginPos) / 2;
	        var f = beginPos;
	        var b = dataLen - encodeLen;
	        for (let i = 0; i < 2; ++i) {
	            for (let j = 0; j < encodeLen; ++j) {
	                data[b++] ^= data[f++];
	            }
	            f -= encodeLen;
	            for (let j = 0; j < encodeLen; ++j) {
	                data[f++] ^= data[--b];
	            }
	            f -= encodeLen;
	        }
	    }
	}

	class ConfigData {
	    static ParseConfig(buff) {
	        this._configData = {};
	        var data = new Uint8Array(buff);
	        EncryptTool.Decrypt(data, 20);
	        var gunzip = new Zlib.Gunzip(data);
	        var plain = gunzip.decompress();
	        var sConfig = Util.Utf8ArrayToStr(plain);
	        this._valuePos = 0;
	        this._pos = 0;
	        while (true) {
	            this._pos = sConfig.indexOf("------@", this._valuePos);
	            if (-1 == this._pos)
	                break;
	            this._pos += 7;
	            let nPos = sConfig.indexOf('\n', this._pos);
	            let cfgName = sConfig.substring(this._pos, nPos);
	            try {
	                let cfgTbl = new ConfigTable();
	                ConfigData._configData[cfgName] = cfgTbl;
	                this._pos = nPos + 1;
	                nPos = sConfig.indexOf('\n', this._pos);
	                this._bFlag = true;
	                while (this._bFlag) {
	                    try {
	                        cfgTbl.AddColKey(this.GetNextValue(nPos, sConfig));
	                    }
	                    catch (err) {
	                        console.error(cfgName);
	                    }
	                }
	                nPos = sConfig.indexOf('\n', this._pos);
	                this._bFlag = true;
	                this._valuePos = nPos + 1;
	                while (this._bFlag) {
	                    let rowName = this.GetNextValue(nPos, sConfig);
	                    let valueNPos = sConfig.indexOf('\n', this._valuePos);
	                    let a = 0;
	                    let rowData = new ConfigRow();
	                    rowData.AddValue(rowName);
	                    this._bFlagEx = true;
	                    while (this._bFlagEx) {
	                        let value = this.GetNextValueEx(valueNPos, sConfig);
	                        value = value.replace("#r", "\r\n");
	                        rowData.AddValue(value);
	                        ++a;
	                    }
	                    cfgTbl.AddRow(rowName, rowData);
	                }
	            }
	            catch (err) {
	                console.error(cfgName);
	            }
	        }
	    }
	    static GetNextValue(nPos, sConfig) {
	        var tPos = sConfig.indexOf('\t', this._pos);
	        if (tPos > nPos || tPos == -1) {
	            tPos = nPos;
	            this._bFlag = false;
	        }
	        var value = sConfig.substring(this._pos, tPos);
	        this._pos = tPos + 1;
	        return value;
	    }
	    static GetNextValueEx(nPos, sConfig) {
	        var tPos = sConfig.indexOf('\t', this._valuePos);
	        if (tPos > nPos || tPos == -1) {
	            tPos = nPos;
	            this._bFlagEx = false;
	        }
	        var value = sConfig.substring(this._valuePos, tPos);
	        this._valuePos = tPos + 1;
	        return value;
	    }
	    static GetColKeys(sKey) {
	        return this._configData[sKey].m_dicColKeys;
	    }
	    static GetTable(sKey) {
	        return this._configData[sKey];
	    }
	    static GetRow(sKey1, sKey2) {
	        return this.GetTable(sKey1).GetRow(sKey2);
	    }
	    static GetValue(sKey1, sKey2, sKey3) {
	        return this.GetRow(sKey1, sKey2).GetValue(sKey3);
	    }
	    static GetStaticText(sKey) {
	        return this.GetValue("Lan_StaticText_Client", sKey, "Text");
	    }
	}

	class PositionMgr {
	}
	PositionMgr.LeftX = -500;
	PositionMgr.RightX = 2420;

	class BulletControl extends Laya.Script {
	    constructor() { super(); }
	    static GetInst() {
	        return BulletControl._inst;
	    }
	    onAwake() {
	        BulletControl._inst = this;
	        this._bulletDict = {};
	        this._bulletDict["BulletAL"] = this.bulletPrefabAL;
	        this._bulletDict["BulletBL"] = this.bulletPrefabBL;
	        this._bulletDict["BulletCL"] = this.bulletPrefabCL;
	    }
	    PopBullet(bulletName) {
	        let bullet = Laya.Pool.getItemByCreateFun(bulletName, this._bulletDict[bulletName].create, this._bulletDict[bulletName]);
	        this.bulletRoot.addChild(bullet);
	        return bullet;
	    }
	}

	class Bullet extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._sp = this.owner;
	    }
	    Excute(bulletName, fromX, fromY, direction) {
	        this._bulletName = bulletName;
	        this._iDirection = direction;
	        this._sp.x = fromX;
	        this._sp.y = fromY;
	    }
	    Stop() {
	        Laya.Tween.clearAll(this._sp);
	        this._sp.x = -10000;
	        this._sp.y = 0;
	        Laya.Pool.recover(this._bulletName, this._sp);
	    }
	}

	class Enemy extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._sp = this.owner;
	    }
	    Show(info) {
	        this._enemyName = info[0];
	        this._iDirection = info[1];
	        this._sp.x = this._iFromX = this._iDirection == 1 ? PositionMgr.LeftX : PositionMgr.RightX;
	        this._sp.y = this._iFromY = info[2];
	        Laya.Tween.to(this._sp, { x: info[3] }, info[4], Laya.Ease.linearNone, Laya.Handler.create(this, this.ShowCompleted));
	    }
	    ShowCompleted() {
	        this.BackCompleted();
	    }
	    BackCompleted() {
	        Laya.Tween.clearAll(this._sp);
	        this._sp.x = -10000;
	        this._sp.y = 0;
	        Laya.Pool.recover(this._enemyName, this._sp);
	    }
	    BulletExcute(bulletName) {
	        let bulletSp = BulletControl.GetInst().PopBullet(bulletName);
	        let bullet = bulletSp.getComponent(Bullet);
	        bullet.Excute(bulletName, this._sp.x, this._sp.y, this._iDirection);
	    }
	}

	var Event = Laya.Event;
	class GameControl extends Laya.Script {
	    constructor() {
	        super();
	        this._iSpeed = 0;
	        this._bRunning = false;
	        this._iDistance = 0;
	        this._t = 0;
	        this._curGroupDis = 0;
	        this._curGroupTbl = null;
	    }
	    onAwake() {
	        this._scoreKey = "airplaneScore";
	        this.startBtn.visible = false;
	        this.resultPanel.visible = false;
	        this.rankPanel.visible = false;
	        this.openDataViewer.visible = false;
	        this._enemyDict = {};
	        this._enemyDict["EnemyAL"] = this.enemyPrefAL;
	        this._enemyDict["EnemyBL"] = this.enemyPrefBL;
	        this._enemyDict["EnemyCL"] = this.enemyPrefCL;
	        this._enemyDict["EnemyZL"] = this.enemyPrefZL;
	        this._enemyDict["EnemyZR"] = this.enemyPrefZR;
	        Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);
	    }
	    OnConfigComplete(buff) {
	        ConfigData.ParseConfig(buff);
	        this._enmeyTbl = ConfigData.GetTable("Enemy_Client");
	        this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
	        this.restartBtn.clickHandler = new Laya.Handler(this, this.onRestartBtnClick);
	        this.continueBtn.clickHandler = new Laya.Handler(this, this.onContinueBtnClick);
	        this.rankBtn.clickHandler = new Laya.Handler(this, this.onRankBtnClick);
	        this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
	        this.mainRole = this.mainRoleSp.getComponent(MainRole);
	        this.background = this.backgroundSp.getComponent(Background);
	        let score = Laya.LocalStorage.getItem("score");
	        this._iHighestScore = score == null ? 0 : Number(Laya.LocalStorage.getItem("score"));
	        Laya.loader.load(["res/atlas/rank.atlas"], Laya.Handler.create(this, () => { Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas"); }));
	        this.explosionSp.x = -10000;
	        this.explosionAni = new Laya.Animation();
	        this.explosionAni.loadAtlas("res/atlas/explosion.atlas", Laya.Handler.create(this, this.ExplosionLoaded));
	    }
	    ExplosionLoaded() {
	        this.explosionSp.addChild(this.explosionAni);
	        this.explosionSp.scaleX = 2;
	        this.explosionSp.scaleY = 2;
	        this.explosionAni.interval = 100;
	        this.startBtn.visible = true;
	        this.mainRole.Init(new Laya.Handler(this, this.Stop), this.explosionSp, this.explosionAni);
	    }
	    onUpdate() {
	        if (this._bRunning) {
	            this.background.Update();
	            this._iDistance += this._iSpeed;
	            this._t += Laya.timer.delta;
	            if (this._t >= 1) {
	                this.distanceText.text = (Math.floor(this._iDistance / 100)).toString();
	                this._t = 0;
	                this.ShowEnemy();
	            }
	        }
	    }
	    Init() {
	        this.mainRole.Reset();
	        this._iSpeed = 5;
	        this.mainRole.RigidBodyEnable(true);
	        this.background.SetSpeed(this._iSpeed);
	        this._bRunning = true;
	        Laya.SoundManager.playMusic("sound/bgm.mp3", 0);
	    }
	    Stop() {
	        Laya.SoundManager.stopMusic();
	        this._bRunning = false;
	        Laya.timer.once(2000, this, this.ShowResultPanel);
	        let score = this._iDistance / 100;
	        if (score > this._iHighestScore) {
	            this._iHighestScore = score;
	            Laya.LocalStorage.setItem("score", score.toString());
	            this.SetUserCloudStorage(score.toString());
	        }
	    }
	    SetUserCloudStorage(data) {
	        var kvDataList = [];
	        var obj = {};
	        obj.wxgame = {};
	        obj.wxgame.score = data;
	        obj.wxgame.update_time = Laya.Browser.now();
	        kvDataList.push({ "key": this._scoreKey, "value": JSON.stringify(obj) });
	        wx.setUserCloudStorage({
	            KVDataList: kvDataList,
	            success: function (e) {
	                console.log('-----success:' + JSON.stringify(e));
	            },
	            fail: function (e) {
	                console.log('-----fail:' + JSON.stringify(e));
	            },
	            complete: function (e) {
	                console.log('-----complete:' + JSON.stringify(e));
	            }
	        });
	    }
	    ShowResultPanel() {
	        this.resultPanel.visible = true;
	        this.curText.text = (this._iDistance / 100).toString();
	        this.maxText.text = Laya.LocalStorage.getItem("score");
	    }
	    onStartBtnClick() {
	        this.startBtn.visible = false;
	        this._iDistance = 0;
	        this.Init();
	    }
	    onRestartBtnClick() {
	        this.resultPanel.visible = false;
	        this.ShowRankPanel(false);
	        this._iDistance = 0;
	        this.Init();
	        this.mainRole.SetInvincible();
	    }
	    onContinueBtnClick() {
	        this.resultPanel.visible = false;
	        this.ShowRankPanel(false);
	        this.Init();
	        this.mainRole.SetInvincible();
	    }
	    onRankBtnClick() {
	        this.ShowRankPanel(!this.rankPanel.visible);
	    }
	    ShowRankPanel(bShow) {
	        this.rankPanel.visible = bShow;
	        this.openDataViewer.visible = bShow;
	        if (bShow)
	            this.openDataViewer.postMsg({ type: "RankOpen" });
	        else
	            this.openDataViewer.postMsg({ type: "RankClose" });
	    }
	    tapSpMouseHandler(e) {
	        if (!this._bRunning)
	            return;
	        switch (e.type) {
	            case Event.MOUSE_DOWN:
	                this.mainRole.Up();
	                break;
	        }
	    }
	    ShowEnemy() {
	        if (this._iDistance % 800 == 0)
	            this.ShowEnemyZ();
	        let key = this._iDistance.toString();
	        if (this._enmeyTbl.HasRow(key)) {
	            let group = this._enmeyTbl.GetValue(key, "Group");
	            this._curGroupTbl = ConfigData.GetTable(group);
	            this._curGroupDis = this._iDistance;
	        }
	        if (this._curGroupDis != 0) {
	            let groupKey = (this._iDistance - this._curGroupDis).toString();
	            if (this._curGroupTbl.HasRow(groupKey)) {
	                let jsonStr = this._curGroupTbl.GetValue(groupKey, "Enemy");
	                let arr = JSON.parse(jsonStr);
	                let sp;
	                let enemyName;
	                let enemy;
	                for (let i = 0; i < arr.length; ++i) {
	                    enemyName = arr[i][0];
	                    sp = Laya.Pool.getItemByCreateFun(enemyName, this._enemyDict[enemyName].create, this._enemyDict[enemyName]);
	                    this.enemyRoot.addChild(sp);
	                    enemy = sp.getComponent(Enemy);
	                    enemy.Show(arr[i]);
	                }
	            }
	        }
	    }
	    ShowEnemyZ() {
	        let enemyName = "EnemyZR";
	        let sp = Laya.Pool.getItemByCreateFun(enemyName, this._enemyDict[enemyName].create, this._enemyDict[enemyName]);
	        this.enemyRoot.addChild(sp);
	        let enemy = sp.getComponent(Enemy);
	        enemy.Show([enemyName, -1, 0, PositionMgr.LeftX, 3000]);
	    }
	}

	class BulletA extends Bullet {
	    constructor() { super(); }
	    Excute(bulletName, fromX, fromY, direction) {
	        super.Excute(bulletName, fromX, fromY, direction);
	        Laya.Tween.to(this._sp, { x: direction == 1 ? PositionMgr.RightX : PositionMgr.LeftX }, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop));
	    }
	}

	class BulletB extends Bullet {
	    constructor() { super(); }
	    Excute(bulletName, fromX, fromY, direction) {
	        super.Excute(bulletName, fromX, fromY, direction);
	        Laya.Tween.to(this._sp, { y: fromY + 100 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.DropCompleted));
	    }
	    DropCompleted() {
	        Laya.timer.once(1000, this, this.Shoot);
	    }
	    Shoot() {
	        Laya.Tween.to(this._sp, { x: this._iDirection == 1 ? PositionMgr.RightX : PositionMgr.LeftX }, 2000, Laya.Ease.linearNone, Laya.Handler.create(this, this.Stop));
	    }
	}

	class BulletC extends Bullet {
	    constructor() { super(); }
	    onAwake() {
	        super.onAwake();
	        this._rigidBody = this.owner.getComponent(Laya.RigidBody);
	        this._rigidBody.enabled = false;
	    }
	    Excute(bulletName, fromX, fromY, direction) {
	        super.Excute(bulletName, fromX, fromY, direction);
	        this._rigidBody.enabled = true;
	        this._rigidBody.setVelocity({ x: direction ? 15 : -15, y: 0 });
	    }
	    onTriggerEnter(other, self, contact) {
	        let sp = other.owner;
	        if (sp.name == "Bottom") {
	            this._rigidBody.enabled = false;
	            this.Stop();
	        }
	    }
	}

	class EnemyA extends Enemy {
	    Back() {
	        Laya.Tween.to(this._sp, { x: this._iFromX, y: this._iFromY }, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	    }
	    ShowCompleted() {
	        this._iTimes1 = 0;
	        this._iTimes2 = 0;
	        Laya.timer.loop(800, this, this.Shoot);
	    }
	    Shoot() {
	        Laya.timer.loop(100, this, this._Shoot);
	        if (++this._iTimes1 > 1) {
	            Laya.timer.clear(this, this.Shoot);
	            this._iTimes1 = 0;
	            this.Back();
	        }
	    }
	    _Shoot() {
	        super.BulletExcute(this._iDirection == 1 ? "BulletAL" : "BulletAR");
	        if (++this._iTimes2 > 2) {
	            Laya.timer.clear(this, this._Shoot);
	            this._iTimes2 = 0;
	        }
	    }
	}

	class EnemyB extends Enemy {
	    ShowCompleted() {
	        this.Shoot();
	    }
	    Shoot() {
	        super.BulletExcute(this._iDirection == 1 ? "BulletBL" : "BulletBR");
	        Laya.timer.once(2000, this, this.Back);
	    }
	    Back() {
	        Laya.Tween.to(this._sp, { x: this._iFromX, y: this._iFromY }, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	    }
	}

	class EnemyC extends Enemy {
	    ShowCompleted() {
	        this.Shoot();
	    }
	    Shoot() {
	        super.BulletExcute(this._iDirection == 1 ? "BulletCL" : "BulletCR");
	        this.Back();
	    }
	    Back() {
	        let toX = this._sp.scaleX == 1 ? PositionMgr.RightX : PositionMgr.LeftX;
	        Laya.Tween.to(this._sp, { x: toX, y: this._iFromY }, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, this.BackCompleted));
	    }
	}

	class GameConfig {
	    constructor() {
	    }
	    static init() {
	        var reg = Laya.ClassUtils.regClass;
	        reg("script/Background.ts", Background);
	        reg("script/MainRole.ts", MainRole);
	        reg("script/GameControl.ts", GameControl);
	        reg("script/BulletControl.ts", BulletControl);
	        reg("script/bullet/BulletA.ts", BulletA);
	        reg("script/bullet/BulletB.ts", BulletB);
	        reg("script/bullet/BulletC.ts", BulletC);
	        reg("script/enemy/EnemyA.ts", EnemyA);
	        reg("script/enemy/EnemyB.ts", EnemyB);
	        reg("script/enemy/EnemyC.ts", EnemyC);
	        reg("script/enemy/Enemy.ts", Enemy);
	    }
	}
	GameConfig.width = 1920;
	GameConfig.height = 1080;
	GameConfig.scaleMode = "fixedheight";
	GameConfig.screenMode = "horizontal";
	GameConfig.alignV = "middle";
	GameConfig.alignH = "center";
	GameConfig.startScene = "MainScene.scene";
	GameConfig.sceneRoot = "";
	GameConfig.debug = true;
	GameConfig.stat = false;
	GameConfig.physicsDebug = false;
	GameConfig.exportSceneToJson = true;
	GameConfig.init();

	class Main {
	    constructor() {
	        if (window["Laya3D"])
	            Laya3D.init(GameConfig.width, GameConfig.height);
	        else
	            Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
	        Laya["Physics"] && Laya["Physics"].enable();
	        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
	        Laya.stage.scaleMode = GameConfig.scaleMode;
	        Laya.stage.screenMode = GameConfig.screenMode;
	        Laya.stage.alignV = GameConfig.alignV;
	        Laya.stage.alignH = GameConfig.alignH;
	        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
	        if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
	            Laya.enableDebugPanel();
	        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
	            Laya["PhysicsDebugDraw"].enable();
	        if (GameConfig.stat)
	            Laya.Stat.show();
	        Laya.alertGlobalError = true;
	        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	    }
	    onVersionLoaded() {
	        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	    }
	    onConfigLoaded() {
	        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene, true, null, Laya.Handler.create(this, (s) => {
	            this.resize();
	        }));
	        Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
	    }
	    resize() {
	        let w = GameConfig.width;
	        let h = GameConfig.height;
	        switch (GameConfig.scaleMode) {
	            case "fixedwidth":
	                let screen_wh_scale = Laya.Browser.width / Laya.Browser.height;
	                h = GameConfig.width / screen_wh_scale;
	                break;
	            case "fixedheight":
	                let screen_hw_scale = Laya.Browser.height / Laya.Browser.width;
	                w = GameConfig.height / screen_hw_scale;
	                Laya.Scene.unDestroyedScenes.forEach(element => {
	                    let s = element;
	                    s.x = (w - GameConfig.width) / 2;
	                });
	                break;
	        }
	    }
	}
	new Main();

}());
//# sourceMappingURL=bundle.js.map
