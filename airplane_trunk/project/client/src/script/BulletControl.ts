export default class BulletControl extends Laya.Script
{
	/** @prop {name: bulletRoot, type: Node} */
	private bulletRoot: Laya.Sprite;
	/** @prop {name: bulletPrefabA, type: Prefab} */
	private bulletPrefabA: Laya.Prefab;

	private static _inst: BulletControl;
	public static GetInst(): BulletControl
	{
		return BulletControl._inst;
	}

	onAwake(): void
	{
		BulletControl._inst = this;
	}

	public PopBulletA(): Laya.Sprite 
	{
		let bullet: Laya.Sprite = Laya.Pool.getItemByCreateFun("bulletA", this.bulletPrefabA.create, this.bulletPrefabA) as Laya.Sprite;
		this.bulletRoot.addChild(bullet);
		return bullet;
	}
}