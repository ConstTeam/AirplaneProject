(function () {
	'use strict';

	class Background extends Laya.Script {
	    constructor() {
	        super();
	        this._bRunning = false;
	    }
	    onUpdate() {
	        if (this._bRunning) {
	            this.bg1.x -= 5;
	            this.bg2.x -= 5;
	            if (this.bg1.x <= -2560)
	                this.bg1.x = 2560;
	            else if (this.bg2.x <= -2560)
	                this.bg2.x = 2560;
	        }
	    }
	    Play() {
	        this._bRunning = true;
	    }
	}

	var Event = Laya.Event;
	class GameControl extends Laya.Script {
	    constructor() { super(); }
	    onAwake() {
	        this.tapSp.on(Event.MOUSE_DOWN, this, this.mouseHandler);
	        this.mainRoleRigid = this.mainRoleSp.getComponent(Laya.RigidBody);
	        this.background = this.backgroundSp.getComponent(Background);
	        this.background.Play();
	    }
	    mouseHandler(e) {
	        switch (e.type) {
	            case Event.MOUSE_DOWN:
	                this.mainRoleRigid.setVelocity({ x: 0, y: -10 });
	                break;
	        }
	    }
	}

	class GameConfig {
	    constructor() {
	    }
	    static init() {
	        var reg = Laya.ClassUtils.regClass;
	        reg("script/GameControl.ts", GameControl);
	        reg("script/Background.ts", Background);
	    }
	}
	GameConfig.width = 1920;
	GameConfig.height = 1080;
	GameConfig.scaleMode = "fixedwidth";
	GameConfig.screenMode = "none";
	GameConfig.alignV = "middle";
	GameConfig.alignH = "center";
	GameConfig.startScene = "MainScene.scene";
	GameConfig.sceneRoot = "";
	GameConfig.debug = false;
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
