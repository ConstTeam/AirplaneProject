/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameControl from "./script/GameControl"
import BulletControl from "./script/BulletControl"
import Background from "./script/Background"
import MainRole from "./script/MainRole"
import BulletA from "./script/BulletA"
import EnemyA from "./script/EnemyA"
import EnemyB from "./script/EnemyB"
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
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/GameControl.ts",GameControl);
        reg("script/BulletControl.ts",BulletControl);
        reg("script/Background.ts",Background);
        reg("script/MainRole.ts",MainRole);
        reg("script/BulletA.ts",BulletA);
        reg("script/EnemyA.ts",EnemyA);
        reg("script/EnemyB.ts",EnemyB);
    }
}
GameConfig.init();