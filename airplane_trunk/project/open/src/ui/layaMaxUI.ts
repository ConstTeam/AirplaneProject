/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.test {
    export class BigUI extends Laya.Scene {
		public _list:Laya.List;
        public static  uiView:any ={"type":"Scene","props":{"width":1000,"height":700},"compId":2,"child":[{"type":"List","props":{"y":50,"x":0,"width":1000,"var":"_list","vScrollBarSkin":" ","spaceY":0,"selectEnable":false,"repeatX":1,"height":600},"compId":3,"child":[{"type":"bigItem","props":{"runtime":"view/bigItem.ts","renderType":"render"},"compId":5}]}],"loadList":[],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(BigUI.uiView);
        }
    }
    REG("ui.test.BigUI",BigUI);
    export class BigItemUI extends Laya.View {
		public img_head:Laya.Image;
		public text_number:Laya.Label;
		public text_name:Laya.Label;
		public text_score:Laya.Label;
        public static  uiView:any ={"type":"View","props":{"width":980,"height":150},"compId":2,"child":[{"type":"Sprite","props":{"y":-8,"x":40,"width":900,"texture":"rank/Separator.png","rotation":0,"height":20},"compId":7},{"type":"Image","props":{"y":20,"x":145,"width":110,"var":"img_head","skin":"rank/cube.png","height":110},"compId":3,"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":110,"texture":"rank/c1.png","renderType":"mask","height":110},"compId":10}]},{"type":"Label","props":{"y":0,"x":0,"width":132,"var":"text_number","valign":"middle","text":"#99","height":150,"fontSize":50,"color":"#4e2623","bold":true,"align":"center"},"compId":11},{"type":"Label","props":{"y":0,"x":298,"width":392,"var":"text_name","valign":"middle","text":"名字","overflow":"scroll","height":150,"fontSize":40,"color":"#4e2623","bold":true,"align":"left"},"compId":4},{"type":"Label","props":{"y":0,"x":722,"width":258,"var":"text_score","valign":"middle","text":"123.456","height":150,"fontSize":50,"color":"#08bf76","bold":true,"align":"center"},"compId":5}],"loadList":["rank/Separator.png","rank/cube.png","rank/c1.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(BigItemUI.uiView);
        }
    }
    REG("ui.test.BigItemUI",BigItemUI);
}