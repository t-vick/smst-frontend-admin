import { Directive, ElementRef, HostListener, Input, AfterViewInit, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements AfterViewInit, OnChanges, OnDestroy {
	@Input() private size: any;//输入属性，当父窗的大小改变时，引发size改变
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;//用于记录鼠标左键是否按下
	private offsetX: number = 0;//绘图区域坐标原点，相对于整幅地图原点的偏移量
	private offsetY: number = 0;
	private locStatusX: number = 20;//鼠标相对于整幅地图的位置的提示信息的位置
	private locStatusY: number =20;
	private cursorX: number;//鼠标相对于整个地图的位置
	private cursorY: number;
	private selectedObj: any;
	private keypressSubscription:any;
	private isSpaceDown: boolean = false;//控制拖动单个对象的开关
	private isKeySDown: boolean = false;//控制单个对象缩放的开关

	constructor(private el: ElementRef){
		this.ctx=this.el.nativeElement.getContext("2d");
		this.selectedObj = {
			x: 0,
			y: 0,
			w: 75,
			h: 75,
			rotateX: 37.5,
			rotateY: 37.5,
			deg: 0.25,
		};

	};

	/**
	 * 调整画布大小，初始化画布重绘地图
	 */
	private resize() {
		this.ctx.canvas.setAttribute('height',this.el.nativeElement.clientHeight);//必须先设置高度？
		this.ctx.canvas.setAttribute('width',this.el.nativeElement.clientWidth);

		/**
		 * 状态栏的位置要去掉画布坐标原点，相对于左上角
		 * （初始化时的this.offsetX,this.offsetY）的偏移量,
		 * 初始化时this.offsetX,this.offsetY由后台根据当前人
		 * 的位置返回给前端
		 */
		this.locStatusX = 20 - this.offsetX;
		this.locStatusY = this.el.nativeElement.clientHeight - this.offsetY - 30;
		/**
		 * 调整大小后，要把原点移动到调整大小前的位置
		 * 否则清空绘图区的时候，有的地方会清理不到
		 * 因为，此时绘图区域与清理区域没有完全重合
		 */
		this.ctx.translate(this.offsetX,this.offsetY);//使绘图区域与清理区域没有完全重合
		
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = '#ff0000';
		this.drawMap();
	}

	/**
	 * 初始化时使画布大小跟其父容器大小相等并初始化画布
	 */
	ngAfterViewInit() {

		if (!this.size) return;
		this.resize();
	}
	/**
	 * 窗口大小改变时调整画布的大小并初始化画布
	 * @param {SimpleChange}} changes [description]
	 */
	ngOnChanges(changes: {[key: string]: SimpleChange}) {
		if (!this.size) return;
		this.resize();
	}

	/**
	 * 鼠标按下，跟随鼠标动作
	 */
	@HostListener('mousedown', ['$event']) private onMouseDown(ev) {
		this.isMouseDown = true;
	}

	/**
	 * 鼠标移动事件处理
	 */
	@HostListener('mousemove', ['$event']) private onMouseMove(ev) {
		if (this.isMouseDown) {
			if (!this.isSpaceDown) {//拖拽地图，整体移动
				this.locStatusX -= ev.movementX;
				this.locStatusY -= ev.movementY;
				//累加坐标原点相对于整幅地图原点的偏移量
				this.offsetX += ev.movementX;
				this.offsetY += ev.movementY;
				this.ctx.translate(ev.movementX, ev.movementY);
			} else if (!this.isKeySDown){//拖拽单个对象
				this.selectedObj.x += ev.movementX;
				this.selectedObj.y += ev.movementY;
				this.selectedObj.rotateX += ev.movementX;
				this.selectedObj.rotateY += ev.movementY;
			} else if (this.isKeySDown) {//缩放当个对象

			}


			this.clearMap();

			this.drawMap();
		}
	}

	/**
	 * 弹起不再跟随鼠标动作
	 */
	@HostListener('mouseup') private onMouseUp() {
		this.isMouseDown = false;
	}
	/**
	 * 当鼠标移除绘图区时，不在处理鼠标移动事件
	 */
	@HostListener('mouseout') private onMouseOut() {
		this.isMouseDown = false;
		this.keypressSubscription.unsubscribe();
		window.removeEventListener('keyup');
		// window.removeEventListener('keydown');
		// window.removeEventListener('keypress');
	}

	@HostListener('mouseenter') private onMouseEnter() {
		let _this:any = this;
		this.keypressSubscription = Observable.fromEvent(window,'keypress')
			.debounceTime(200)
			.subscribe((ev) => { _this.onKeyPress(ev); });
		window.addEventListener('keyup', (ev) => { _this.onKeyUp(ev) });
		// window.addEventListener('keydown', (ev) => { _this.onKeyDown(ev); });
		// window.addEventListener('keypress', (ev) => { _this.onKeyPress(ev); });
	}

	@HostListener('dblclick') private onDblClick() {
		console.log('dbl');
	}

	onKeyDown(ev) {
		switch(ev.code) {
			case 'Space':
			{

			}
			break;
		}
		// ev.preventDefault();//这里阻止了，就不会调用onKeyPress了
	}

	onKeyPress(ev) {
		switch(ev.code) {
			case 'KeyA':
				{
					this.selectedObj.deg += 0.0375;
					this.clearMap();
					this.drawMap();
				}
				break;
			case 'KeyD':
				{
					this.selectedObj.deg -= 0.0375;
					this.clearMap();
					this.drawMap();
				}
				break;
			case 'Space':
			{
				this.isSpaceDown = true;
			}
			break;
		}
		ev.preventDefault();//防止按下空格后页面滚动
	}

	onKeyUp(ev) {
		switch (ev.code) {
			case 'Space':
				/**
				 * 这里要做一定的延时处理，因为Space键按着不放的时候，
				 * 会触发两次keypress事件，而这两次中的最后一次刚好在
				 * Space键弹起的keyup之后，因此如果不延时，this.isSpaceDown
				 * 在这里设为false后，又会变成true
				 */
				setTimeout(() => this.isSpaceDown = false, 200);
				break;
			default:
				// code...
				break;
		}
	}

	/**
	 * 清空绘图区域
	 */
	private clearMap() {
		this.ctx.clearRect(-this.offsetX,-this.offsetY,this.el.nativeElement.clientWidth,this.el.nativeElement.clientHeight);
	}

	/**
	 * 画图
	 */
	private drawMap() {
		this.ctx.fillStyle = '#000000';
		this.ctx.fillText(`X:${this.offsetX} | Y:${this.offsetY}`,this.locStatusX,this.locStatusY);
		this.ctx.fillStyle = '#ff0000';
		this.ctx.fillRect(this.selectedObj.x,this.selectedObj.y,this.selectedObj.w,this.selectedObj.h);
		this.ctx.save();
		this.ctx.translate(this.selectedObj.rotateX, this.selectedObj.rotateY);
		this.ctx.rotate(Math.PI*this.selectedObj.deg);
		this.ctx.translate(-this.selectedObj.rotateX, -this.selectedObj.rotateY);
		this.ctx.fillRect(this.selectedObj.x,this.selectedObj.y,this.selectedObj.w,this.selectedObj.h);
		this.ctx.restore();
	}

	ngOnDestroy() {

	}

}