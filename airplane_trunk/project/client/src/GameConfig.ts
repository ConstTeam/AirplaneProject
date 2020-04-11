/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Background from "./script/Background"
import MainRole from "./script/MainRole"
import GameControl from "./script/GameControl"
import BulletControl from "./script/BulletControl"
import BulletA from "./script/bullet/BulletA"
import BulletB from "./script/bullet/BulletB"
import BulletC from "./script/bullet/BulletC"
import EnemyA from "./script/enemy/EnemyA"
import EnemyA2 from "./script/enemy/EnemyA2"
import EnemyB from "./script/enemy/EnemyB"
import EnemyB2 from "./script/enemy/EnemyB2"
import EnemyC from "./script/enemy/EnemyC"
import EnemyC2 from "./script/enemy/EnemyC2"
import Enemy from "./script/enemy/Enemy"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1920;
    static height:number=1080;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="MainScene.scene";
    static sceneRoot:string="";
    static debug:boolean=true;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/Background.ts",Background);
        reg("script/MainRole.ts",MainRole);
        reg("script/GameControl.ts",GameControl);
        reg("script/BulletControl.ts",BulletControl);
        reg("script/bullet/BulletA.ts",BulletA);
        reg("script/bullet/BulletB.ts",BulletB);
        reg("script/bullet/BulletC.ts",BulletC);
        reg("script/enemy/EnemyA.ts",EnemyA);
        reg("script/enemy/EnemyA2.ts",EnemyA2);
        reg("script/enemy/EnemyB.ts",EnemyB);
        reg("script/enemy/EnemyB2.ts",EnemyB2);
        reg("script/enemy/EnemyC.ts",EnemyC);
        reg("script/enemy/EnemyC2.ts",EnemyC2);
        reg("script/enemy/Enemy.ts",Enemy);
    }
}
GameConfig.init();