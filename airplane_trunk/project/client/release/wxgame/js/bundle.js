(function () {
	'use strict';

	class Background extends Laya.Script {
	    constructor() { super(); }
	    SetSpeed(speed) {
	        this._iSpeed = speed;
	    }
	    Update() {
	        this.bg1.x -= this._iSpeed;
	        this.bg2.x -= this._iSpeed;
	        if (this.bg1.x <= -2560)
	            this.bg1.x = 2560;
	        else if (this.bg2.x <= -2560)
	            this.bg2.x = 2560;
	    }
	}

	class BulletA extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._sp = this.owner;
	        this.enabled = false;
	    }
	    onUpdate() {
	        this._sp.x += this._iSpeed;
	        if (this._sp.x >= 3000)
	            this.Stop();
	    }
	    Excute(x, y, speed) {
	        this._sp.x = x;
	        this._sp.y = y;
	        this._iSpeed = speed;
	        this.enabled = true;
	    }
	    Stop() {
	        this.enabled = false;
	        Laya.Pool.recover("bulletA", this._sp);
	    }
	}

	class MainRole extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._rigidbody = this.owner.getComponent(Laya.RigidBody);
	        this.RigidBodyEnable(false);
	    }
	    onTriggerEnter(other, self, contact) {
	        this.RigidBodyEnable(false);
	        this._stopCbHandler.run();
	        let sp = other.owner;
	        if (sp.name == "BulletA") {
	            sp.visible = false;
	            sp.getComponent(BulletA).Stop();
	        }
	    }
	    Init(stopCbHandler) {
	        this._stopCbHandler = stopCbHandler;
	    }
	    RigidBodyEnable(bEnable) {
	        this._rigidbody.enabled = bEnable;
	    }
	    Up() {
	        this._rigidbody.setVelocity({ x: 0, y: -10 });
	    }
	}

	class BulletControl extends Laya.Script {
	    constructor() { super(); }
	    static GetInst() {
	        return BulletControl._inst;
	    }
	    onAwake() {
	        BulletControl._inst = this;
	    }
	    PopBulletA() {
	        let bullet = Laya.Pool.getItemByCreateFun("bulletA", this.bulletPrefabA.create, this.bulletPrefabA);
	        this.bulletRoot.addChild(bullet);
	        return bullet;
	    }
	}

	class EnemyA extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this._sp = this.owner;
	    }
	    Move(fromX, fromY, toX, toY) {
	        this._sp.x = fromX;
	        this._sp.y = fromY;
	        Laya.Tween.to(this._sp, { x: toX, y: toY }, 3000, Laya.Ease.linearNone, Laya.Handler.create(this, this.MoveCompleted));
	    }
	    MoveCompleted() {
	        let bulletSp = BulletControl.GetInst().PopBulletA();
	        let bullet = bulletSp.getComponent(BulletA);
	        bullet.Excute(this._sp.x + 153, this._sp.y + 61, 10);
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
	        this.m_dicColKeys[colKey] = this._iColLength;
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

	var Event = Laya.Event;
	class GameControl extends Laya.Script {
	    constructor() {
	        super();
	        this._iSpeed = 0;
	        this._bRunning = false;
	        this._iDistance = 0;
	        this._t = 0;
	    }
	    onAwake() {
	        Laya.loader.load("cfg/cfg.bin", Laya.Handler.create(this, this.OnConfigComplete), null, Laya.Loader.BUFFER);
	    }
	    OnConfigComplete(buff) {
	        ConfigData.ParseConfig(buff);
	        this._enmeyTbl = ConfigData.GetTable("Enemy_Client");
	        this.startBtn.clickHandler = new Laya.Handler(this, this.onStartBtnClick);
	        this.tapSp.on(Event.MOUSE_DOWN, this, this.tapSpMouseHandler);
	        this.mainRole = this.mainRoleSp.getComponent(MainRole);
	        this.background = this.backgroundSp.getComponent(Background);
	        this.mainRole.Init(new Laya.Handler(this, this.Stop));
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
	    Start() {
	        this.startBtn.visible = false;
	        this._iSpeed = 5;
	        this.mainRole.RigidBodyEnable(true);
	        this.background.SetSpeed(this._iSpeed);
	        this._bRunning = true;
	    }
	    Stop() {
	        this._bRunning = false;
	    }
	    onStartBtnClick() {
	        this.Start();
	    }
	    tapSpMouseHandler(e) {
	        switch (e.type) {
	            case Event.MOUSE_DOWN:
	                this.mainRole.Up();
	                break;
	        }
	    }
	    ShowEnemy() {
	        let key = this._iDistance.toString();
	        if (this._enmeyTbl.HasRow(key)) {
	            let jsonStr = this._enmeyTbl.GetValue(key, "Enemy");
	            let arr = JSON.parse(jsonStr);
	            for (let i = 0; i < arr.length; ++i) {
	                let enemyASp = Laya.Pool.getItemByCreateFun("enemyA", this.enemyPrefabA.create, this.enemyPrefabA);
	                this.enemyRoot.addChild(enemyASp);
	                let enemyA = enemyASp.getComponent(EnemyA);
	                enemyA.Move(arr[i][1], arr[i][2], arr[i][3], arr[i][4]);
	            }
	        }
	    }
	}

	class GameConfig {
	    constructor() {
	    }
	    static init() {
	        var reg = Laya.ClassUtils.regClass;
	        reg("script/GameControl.ts", GameControl);
	        reg("script/BulletControl.ts", BulletControl);
	        reg("script/Background.ts", Background);
	        reg("script/MainRole.ts", MainRole);
	        reg("script/BulletA.ts", BulletA);
	        reg("script/EnemyA.ts", EnemyA);
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
	        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	    }
	}
	new Main();

}());
//# sourceMappingURL=bundle.js.map
