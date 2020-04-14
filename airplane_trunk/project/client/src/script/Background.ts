import Sprite = Laya.Sprite;

export default class Background extends Laya.Script
{
	/** @prop {name: ground1, type:Node} */
	private ground1: Sprite;
	/** @prop {name: ground2, type:Node} */
	private ground2: Sprite;
	/** @prop {name: ground3, type:Node} */
	private ground3: Sprite;

	/** @prop {name: mountains1, type:Node} */
	private mountains1: Sprite;
	/** @prop {name: mountains2, type:Node} */
	private mountains2: Sprite;
	/** @prop {name: mountains3, type:Node} */
	private mountains3: Sprite;
	
	/** @prop {name: cloud1, type:Node} */
	private cloud1: Sprite;
	/** @prop {name: cloud2, type:Node} */
	private cloud2: Sprite;
	/** @prop {name: cloud3, type:Node} */
	private cloud3: Sprite;

	private _iSpeed: number;
	private _iSpeed2: number;
	private _iSpeed3: number;

	private _arrGround: Sprite[];
	private _arrMountains: Sprite[];
	private _arrCloud: Sprite[];
	private _curGroundIndex: number;
	private _curMountainsIndex: number;
	private _curCloudIndex: number;
	private _curGround: Sprite;
	private _curMountains: Sprite;
	private _curCloud: Sprite;

	constructor() { super(); }

	onAwake(): void
	{
		var _$this = this;
		_$this._arrGround = [_$this.ground1, _$this.ground2, _$this.ground3];
		_$this._arrMountains = [_$this.mountains1, _$this.mountains2, _$this.mountains3];
		_$this._arrCloud = [_$this.cloud1, _$this.cloud2, _$this.cloud3];
		_$this._curGroundIndex = 0;
		_$this._curMountainsIndex = 0;
		_$this._curCloudIndex = 0;
		_$this._curGround = _$this._arrGround[0];
		_$this._curMountains = _$this._arrMountains[0];
		_$this._curCloud = _$this._arrCloud[0];
	}

	public SetSpeed(speed: number): void
	{
		this._iSpeed = speed;
		this._iSpeed2 = speed / 5;
		this._iSpeed3 = speed / 25;
	}

	public Update(): void
	{
		var _$this = this;
		if(_$this._curGround.x <= -2040)
		{
			_$this._curGround.x = 2456 + 2040 + _$this._curGround.x;
			_$this._curGroundIndex = _$this._curGroundIndex == 2 ? 0 : _$this._curGroundIndex + 1;
			_$this._curGround = _$this._arrGround[_$this._curGroundIndex];
		}
		if(_$this._curMountains.x <= -3136)
		{
			_$this._curMountains.x = 3004 + 3136 + _$this._curMountains.x;
			_$this._curMountainsIndex = _$this._curMountainsIndex == 2 ? 0 : _$this._curMountainsIndex + 1;
			_$this._curMountains = _$this._arrMountains[_$this._curMountainsIndex];
		}
		if(_$this._curCloud.x <= -3436)
		{
			_$this._curCloud.x = 3154 + 3436 + _$this._curCloud.x;
			_$this._curCloudIndex = _$this._curCloudIndex == 2 ? 0 : _$this._curCloudIndex + 1;
			_$this._curCloud = _$this._arrCloud[_$this._curCloudIndex];
		}

		for(let i = 0; i < 3; ++i)
		{
			_$this._arrGround[i].x		-= this._iSpeed;
			_$this._arrMountains[i].x	-= this._iSpeed2;
			_$this._arrCloud[i].x		-= this._iSpeed3;
		}
	}
}