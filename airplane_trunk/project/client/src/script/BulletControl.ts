export default class BulletControl extends Laya.Script
{
	/** @prop {name: bulletRoot, type: Node} */
	private bulletRoot: Laya.Sprite;
	/** @prop {name: bulletPrefabAL, type: Prefab} */
	private bulletPrefabAL: Laya.Prefab;
	/** @prop {name: bulletPrefabBL, type: Prefab} */
	private bulletPrefabBL: Laya.Prefab;
	/** @prop {name: bulletPrefabCL, type: Prefab} */
	private bulletPrefabCL: Laya.Prefab;

	private _bulletDict: { [key: string]: Laya.Prefab; };

	private static _inst: BulletControl;
	public static GetInst(): BulletControl
	{
		return BulletControl._inst;
	}

	constructor() { super(); }
	
	onAwake(): void
	{
		BulletControl._inst = this;
		this._bulletDict = {};
		this._bulletDict["BulletAL"] = this.bulletPrefabAL;
		this._bulletDict["BulletBL"] = this.bulletPrefabBL;
		this._bulletDict["BulletCL"] = this.bulletPrefabCL;
	}

	public PopBullet(bulletName: string): Laya.Sprite
	{
		let bullet: Laya.Sprite = Laya.Pool.getItemByCreateFun(bulletName, this._bulletDict[bulletName].create, this._bulletDict[bulletName]) as Laya.Sprite;
		this.bulletRoot.addChild(bullet);
		return bullet;
	}
}