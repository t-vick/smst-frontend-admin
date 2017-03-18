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
	private topLeftX: number = 0;//窗口左上角，相对于整幅地图原点的坐标
	private topLeftY: number = 0;//初始值与offsetY相同，从后台获取
	private locStatusX: number = 20;//鼠标相对于整幅地图的位置的提示信息的位置
	private locStatusY: number =20;
	private cursorX: number = 0;//鼠标相对于整个地图的位置
	private cursorY: number = 0;
	private selectedObj: any;
	private keypressSubscription:any;
	private isSpaceDown: boolean = false;//控制拖动单个对象的开关
	private isKeySDown: boolean = false;//控制单个对象缩放的开关
	private objList: any;

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

		this.objList = [
			{
				x: 150,
				y: 150,
				w: 75,
				h: 75,
				rotateX: 37.5,
				rotateY: 37.5,
				deg: 0,
			},
			this.selectedObj,
		]

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

	private isCursorInObj() {
		//还要判断元素是车位还是立柱还是道路
		if (this.cursorX > this.selectedObj.x && this.cursorX < this.selectedObj.x + this.selectedObj.w 
			&& this.cursorY > this.selectedObj.y && this.cursorY < this.selectedObj.y + this.selectedObj.h) {
			return true;
		}
		// //宽度变为负数的情况
		// if (this.cursorX < this.selectedObj.x && this.cursorX > this.selectedObj.x + this.selectedObj.w 
		// 	&& this.cursorY > this.selectedObj.y && this.cursorY < this.selectedObj.y + this.selectedObj.h) {
		// 	return true;
		// }

		// //高度变为负数的情况
		// if (this.cursorX > this.selectedObj.x && this.cursorX < this.selectedObj.x + this.selectedObj.w 
		// 	&& this.cursorY < this.selectedObj.y && this.cursorY > this.selectedObj.y + this.selectedObj.h) {
		// 	return true;
		// }

		// //宽度、高度都变为负数的情况
		// if (this.cursorX < this.selectedObj.x && this.cursorX > this.selectedObj.x + this.selectedObj.w 
		// 	&& this.cursorY < this.selectedObj.y && this.cursorY > this.selectedObj.y + this.selectedObj.h) {
		// 	return true;
		// }
		//先求出旋转后被选择对象各个点的坐标
		//对角线的一半
		let halfDiagonal: number = Math.sqrt(Math.pow(this.selectedObj.w, 2) + Math.pow(this.selectedObj.h, 2)) / 2;
		//旋转前，对角线与X轴的夹角
		let fi: number = Math.atan( this.selectedObj.h / this.selectedObj.w );

		//当旋转角deg与fi之和小于90°时
		//四个角按照上右下左的顺序
		let addDirectionX1 = 1;
		if (this.selectedObj.deg + fi < Math.PI / 2) {
			addDirectionX1 = -1;
		} else {
			addDirectionX1 = 1;
		}
		let x1: number = this.selectedObj.x + (this.selectedObj.w / 2 + halfDiagonal * Math.cos(this.selectedObj.deg + fi) * addDirectionX1);

		let addDirectionY1 = 1;
		if (this.selectedObj.deg < Math.PI - fi) {
			addDirectionY1 = -1;
		} else {
			addDirectionY1 = 1;
		}
		let y1: number = this.selectedObj.y - (halfDiagonal * Math.abs(Math.cos( this.selectedObj.deg + fi)) + this.selectedObj.h / 2 * addDirectionY1);

		let addDirectionX2 = 1;
		if (this.selectedObj.deg < Math.PI / 2 + fi) {
			addDirectionX2 = 1;
		} else {
			addDirectionX2 = -1;
		}
		let x2: number = (this.selectedObj.x + this.selectedObj.w) - (this.selectedObj.w / 2 - halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirectionX2);

		let addDirectionY2 = 1;
		if (this.selectedObj.deg < fi ) {
			addDirectionY2 = -1;
		} else {
			addDirectionY2 = 1;
		}
		let y2: number = this.selectedObj.y + (this.selectedObj.h / 2 + halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirectionY2);

		let addDirectionX3 = 1;
		if (this.selectedObj.deg < Math.PI / 2 -fi) {
			addDirectionX3 = -1
		} else {
			addDirectionX3 = 1;
		}
		let x3: number = (this.selectedObj.x + this.selectedObj.w) - (this.selectedObj.w / 2 + halfDiagonal * Math.cos(this.selectedObj.deg + fi) * addDirectionX3);

		let addDirectionY3 = 1;
		if (this.selectedObj.deg < Math.PI - fi) {
			addDirectionY3 = -1;
		} else {
			addDirectionY3 = 1;
		}
		let y3: number = (this.selectedObj.y + this.selectedObj.h) + (halfDiagonal * Math.cos( this.selectedObj.deg + fi) + this.selectedObj.h / 2 * addDirectionY3);

		let addDirectionX4 = 1;
		if (this.selectedObj.deg < Math.PI / 2 + fi) {
			addDirectionX4 = -1;
		} else {
			addDirectionX4 = 1;
		}
		let x4: number = this.selectedObj.x + (this.selectedObj.w / 2 + halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirectionX4);

		let addDirectionY4 = 1;
		if (this.selectedObj.deg < fi ) {
			addDirectionY4 = -1;
		} else {
			addDirectionY4 = 1;
		}
		let y4: number = (this.selectedObj.y + this.selectedObj.h) - (this.selectedObj.h / 2 + halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirectionY4);


		// if (this.selectedObj.deg + fi < Math.PI / 2) {
		// 	let x1: number = this.selectedObj.x + (this.selectedObj.w / 2 - halfDiagonal * Math.cos(this.selectedObj.deg + fi));
		// 	let y1: number = this.selectedObj.y - (halfDiagonal * Math.cos( this.selectedObj.deg + fi) - this.selectedObj.h / 2);

		// 	let x2: number = (this.selectedObj.x + this.selectedObj.w) + (halfDiagonal * Math.cos( fi - this.selectedObj.deg ) - this.selectedObj.w / 2);

		// 	let addDirection2 = 1;
		// 	if (this.selectedObj.deg < fi ) {
		// 		addDirection2 = -1;
		// 	} else {
		// 		addDirection2 = 1;
		// 	}
		// 	let y2: number = this.selectedObj.y + (this.selectedObj.h / 2 + halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirection2);

		// 	let x3: number = (this.selectedObj.x + this.selectedObj.w) - (this.selectedObj.w / 2 - halfDiagonal * Math.cos(this.selectedObj.deg + fi));
		// 	let y3: number = (this.selectedObj.y + this.selectedObj.h) + (halfDiagonal * Math.cos( this.selectedObj.deg + fi) - this.selectedObj.h / 2);

		// 	let x4: number = this.selectedObj.x + this.selectedObj.w / 2 - halfDiagonal * Math.cos( fi - this.selectedObj.deg );
		// 	let addDirection4 = 1;
		// 	if (this.selectedObj.deg < fi ) {
		// 		addDirection4 = -1;
		// 	} else {
		// 		addDirection4 = 1;
		// 	}
		// 	let y4: number = (this.selectedObj.y + this.selectedObj.h) - (this.selectedObj.h / 2 + halfDiagonal * Math.cos( fi - this.selectedObj.deg ) * addDirection4);
			
		// }

		return false;
	}

	/**
	 * 鼠标移动事件处理
	 */
	@HostListener('mousemove', ['$event']) private onMouseMove(ev) {
		if (this.isMouseDown) {
			if (!this.isSpaceDown && !this.isKeySDown || 
				this.isSpaceDown && this.isKeySDown) {//拖拽地图，整体移动
				this.locStatusX -= ev.movementX;
				this.locStatusY -= ev.movementY;
				//累加坐标原点相对于整幅地图原点的偏移量
				this.offsetX += ev.movementX;
				this.offsetY += ev.movementY;
				//累加窗口左上角，相对整幅地图原点的总偏移量
				this.topLeftX -= ev.movementX;
				this.topLeftY -= ev.movementY;

				this.ctx.translate(ev.movementX, ev.movementY);
			} else if (this.isSpaceDown){//拖拽单个对象
				//判断鼠标是否点中对象
				if (this.isCursorInObj()) {
					this.selectedObj.x += ev.movementX;
					this.selectedObj.y += ev.movementY;
					this.selectedObj.rotateX += ev.movementX;
					this.selectedObj.rotateY += ev.movementY;
				}
		
			} else if (this.isKeySDown) {//缩放当个对象
				if (this.selectedObj.w > 10) {
					this.selectedObj.w += ev.movementX;
					//旋转中心也得随着变动
					this.selectedObj.rotateX += ev.movementX / 2;
				} else if (ev.movementX > 0) {
					this.selectedObj.w += ev.movementX;
					//旋转中心也得随着变动
					this.selectedObj.rotateX += ev.movementX / 2;
				}

				if (this.selectedObj.h > 10) {
					this.selectedObj.h += ev.movementY;
					this.selectedObj.rotateY += ev.movementY / 2;
				} else if (ev.movementY > 0) {//小于或等于10时，只能放大
					this.selectedObj.h += ev.movementY;
					this.selectedObj.rotateY += ev.movementY / 2;
				}


				
			}


			// this.clearMap();

			// this.drawMap();
		}
		/**
		 * 记录鼠标的当前位置,必须放到处理地图拖拽之后
		 * 否则当this.offsetX,this.offsetY变化的时候，
		 * 不能把变化量累加到this.cursorX,this.cursorY
		 * 从而导致，当拖拽地图后，鼠标不能准确的点中
		 * 要拖拽的对象，使对象不能拖拽
		 */
		//计算鼠标相对于整幅地图原点的坐标
		this.cursorX = this.topLeftX + ev.layerX;
		this.cursorY = this.topLeftY + ev.layerY;
		this.clearMap();

		this.drawMap();
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
			.debounceTime(100)
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
					//对于简单的矩形而言，当deg大于1(180°),就进入循环了
					if (this.selectedObj.deg >= 1) {
						this.selectedObj.deg -= 1;
					}
					this.clearMap();
					this.drawMap();
				}
				break;
			case 'KeyD':
				{
					this.selectedObj.deg -= 0.0375;
					// if (this.selectedObj.deg >= 1) {
					// 	this.selectedObj.deg -= 1;
					// }
					if ( this.selectedObj.deg < 0) {
						this.selectedObj.deg += 1;
					}
					this.clearMap();
					this.drawMap();
				}
				break;
			case 'KeyS': 
				{
					this.isKeySDown = !this.isKeySDown;
					this.clearMap();
					this.drawMap();
				}
				break;
			case 'Space':
			{
				/**
				 * 添加观察者模式后，keypress事件成对出现
				 * 刚好第一次开启isSpaceDown,一次关闭isSpaceDown
				 */
				this.isSpaceDown = !this.isSpaceDown;
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
			case 'KeyS':
				setTimeout(() => this.isKeySDown = false, 200);
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
		this.ctx.fillText(`X:${this.cursorX} | Y:${this.cursorY}`,this.locStatusX,this.locStatusY);
		this.ctx.fillStyle = '#ff0000';
		// this.ctx.fillRect(this.selectedObj.x,this.selectedObj.y,this.selectedObj.w,this.selectedObj.h);
		for (let obj of this.objList) {
			this.ctx.save();
			this.ctx.translate(obj.rotateX, obj.rotateY);
			this.ctx.rotate(Math.PI*obj.deg);
			this.ctx.translate(-obj.rotateX, -obj.rotateY);
			this.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
			this.ctx.restore();
		}
		// this.ctx.save();
		// this.ctx.translate(this.selectedObj.rotateX, this.selectedObj.rotateY);
		// this.ctx.rotate(Math.PI*this.selectedObj.deg);
		// this.ctx.translate(-this.selectedObj.rotateX, -this.selectedObj.rotateY);
		// this.ctx.fillRect(this.selectedObj.x,this.selectedObj.y,this.selectedObj.w,this.selectedObj.h);
		// this.ctx.restore();
	}

	/**
	 * 重绘鼠标位置状态
	 */
	// private drawCursorLoc() {
	// 	this.ctx.save();
	// 	this.ctx.fillStyle = '#000000';
	// 	this.ctx.fillText(`X:${this.cursorX} | Y:${this.cursorY}`,this.locStatusX,this.locStatusY);
	// 	this.ctx.fillStyle = '#ff0000';
	// 	this.ctx.restore();
	// }

	ngOnDestroy() {

	}

}