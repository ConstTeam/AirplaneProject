export default class BulletControl extends Laya.Script
{
	/** @prop {name: bulletRoot, type: Node} */
	private bulletRoot: Laya.Sprite;
	/** @prop {name: bulletPrefabA, type: Prefab} */
	private bulletPrefabA: Laya.Prefab;
	/** @prop {name: bulletPrefabB, type: Prefab} */
	private bulletPrefabB: Laya.Prefab;
	/** @prop {name: bulletPrefabC, type: Prefab} */
	private bulletPrefabC: Laya.Prefab;

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
		this._bulletDict["BulletA"] = this.bulletPrefabA;
		this._bulletDict["BulletB"] = this.bulletPrefabB;
		this._bulletDict["BulletC"] = this.bulletPrefabC;
	}

	public PopBullet(bulletName: string): Laya.Sprite
	{
		let bullet: Laya.Sprite = Laya.Pool.getItemByCreateFun(bulletName, this._bulletDict[bulletName].create, this._bulletDict[bulletName]) as Laya.Sprite;
		this.bulletRoot.addChild(bullet);
		return bullet;
	}
}