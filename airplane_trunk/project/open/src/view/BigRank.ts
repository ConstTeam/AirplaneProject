import { ui } from "../ui/layaMaxUI"
export default class BigRank extends ui.test.BigUI
{
		constructor() { super(); }

		/**获取好友排行榜时的key */
		private _key: String = 'airplaneScore';
		private _curPage: number = 0;
		private _friendArr: any[] = [];

		/**
		 * 初始化
		 */
		public init()
		{
			Laya.stage.addChild(this);
			if(Laya.Browser.onMiniGame)
				wx.onMessage(this.recevieData.bind(this));  //接受来自主域的信息
			
			this.setlist([]);
			this.SetInfo();
			this._left.clickHandler = new Laya.Handler(this, this.onLeftBtnClick);
			this._right.clickHandler = new Laya.Handler(this, this.onRightBtnClick);
		}

		private curArr: any[] = [];
		private onLeftBtnClick(): void
		{
			var _$this = this;
			--_$this._curPage;
			_$this.SetInfo();
		}

		private onRightBtnClick(): void
		{
			var _$this = this;
			++_$this._curPage;
			_$this.SetInfo();
		}

		private SetInfo(): void
		{
			var _$this = this;
			_$this.curArr = [];
			for(let i = 0; i < 4; ++i)
			{
				if(_$this._friendArr.length < _$this._curPage * 4 + i + 1)
					break;
				_$this.curArr[i] = _$this._friendArr[_$this._curPage * 4 + i]
			}
			_$this.setlist(this.curArr);

			_$this._left.visible = false;
			_$this._right.visible = false;
			if(_$this._curPage > 0)
				_$this._left.visible = true;
			if(_$this._curPage < _$this._friendArr.length / 4 - 1)
				_$this._right.visible = true;
		}
 
		/**
		 * 获取好友排行
		 */
		private getFriendData(): void
		{
			var _$this = this;
			wx.getFriendCloudStorage({
				keyList:[this._key],
				success: (res: any) => {
					//关于拿到的数据详细情况可以产看微信文档
					//https://developers.weixin.qq.com/minigame/dev/api/UserGameData.html
					var listData;
					var obj;
					var kv;
					var arr = [];
					console.log('-----------------getFriendCloudStorage------------');
					if(res.data)
					{
						for(var i = 0; i < res.data.length; i++){
							obj = res.data[i];
							if(!(obj.KVDataList.length))
								continue
							//拉取数据是，使用了多少个key- KVDataList的数组就有多少
							//更详细的KVData可以查看微信文档:https://developers.weixin.qq.com/minigame/dev/api/KVData.html
							kv = obj.KVDataList[0];
							if(kv.key!=_$this._key)
								continue
							kv = JSON.parse(kv.value)
							listData = {};
							listData.avatarIP = obj.avatarUrl;
							listData.UserName = obj.nickname;
							listData.openID = obj.openid;
							listData.RankValue = kv.wxgame.score;
							listData.update_time = kv.wxgame.update_time;
							arr.push(listData);
						}
						//根据RankValue排序
						arr = arr.sort(function(a,b){
							return b.RankValue - a.RankValue;
						});
						//增加一个用于查看的index排名
						for(var i = 0; i< arr.length;i++){
							arr[i].index = i + 1;
						}
						//设置数组
						_$this._friendArr = arr;

						_$this._curPage = 0;
						_$this.SetInfo();
					}
				}
				,fail: (res: any) => {
					console.log('------------------获取托管数据失败--------------------');
					console.log(res);
				}
			});
		}

		/**
		 * 接收信息
		 * @param message 收到的主域传过来的信息
		 */
		private recevieData(message): void
		{
			var _$this = this;
			var type: String = message.type;
			switch(type)
			{
				case "RankOpen":
					_$this.visible = true;
					_$this._left.visible = false;
					_$this._right.visible = false;
					_$this.getFriendData();
					break;
				case "RankClose":
					_$this.visible = false;
					break;
				default:
					break;
			}
		}

		/**
		 * 设置list arr
		 * @param arr 赋值用的arr
		 */
		private setlist(arr): void
		{
			this._list.array = arr;
			this._list.refresh();
		}
	}
