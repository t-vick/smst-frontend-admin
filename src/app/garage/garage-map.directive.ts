import { Directive, ElementRef, HostListener, Input, AfterViewInit, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Point } from './model/point.model';
import { Cell } from './model/cell.model';
import { Road } from './model/road.model';
@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements AfterViewInit, OnChanges, OnDestroy {
	@Input() private size: any;//输入属性，当父窗的大小改变时，引发size改变
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;//用于记录鼠标左键是否按下
	private offset: Point = new Point(0, 0);//绘图区域坐标原点，相对于整幅地图原点的偏移量
	private topLeft: Point = new Point(0, 0);//窗口左上角，相对于整幅地图原点的坐标,初始值与offset.y相同，从后台获取
	private locStatus: Point = new Point(20, 20);//鼠标相对于整幅地图的位置的提示信息的位置
	private cursor: Point = new Point(0, 0);//鼠标相对于整个地图的位置
	private selectedObj: any;
	private keypressSubscription:any;
	private isSpaceDown: boolean = false;//控制拖动单个对象的开关
	private isKeySDown: boolean = false;//控制单个对象缩放的开关
	private cellList: Array<Cell>;
	private roadList: Array<Road>;

	constructor(private el: ElementRef){
		this.ctx=this.el.nativeElement.getContext("2d");
		this.cellList = [
			new Cell(150, 150, 75, 75, 187.5, 187.5, 0),

			new Cell(0, 0, 75, 75, 37.5,37.5,0.25)
		];

		this.roadList = [
			new Road(-10, 250, 400, 250, 20),
			new Road(-10, 400, 400, 400, 20),
			new Road(30, -10, 30, 800, 20),
			new Road(330, -10, 330, 800, 20),
    	];

	};

	/**
	 * 调整画布大小，初始化画布重绘地图
	 */
	private resize() {
		this.ctx.canvas.setAttribute('height',this.el.nativeElement.clientHeight);//必须先设置高度？
		this.ctx.canvas.setAttribute('width',this.el.nativeElement.clientWidth);

		/**
		 * 状态栏的位置要去掉画布坐标原点，相对于左上角
		 * （初始化时的this.offset.x,this.offset.y）的偏移量,
		 * 初始化时this.offset.x,this.offset.y由后台根据当前人
		 * 的位置返回给前端
		 */
		this.locStatus.x = 20 - this.offset.x;
		this.locStatus.y = this.el.nativeElement.clientHeight - this.offset.y - 30;
		/**
		 * 调整大小后，要把原点移动到调整大小前的位置
		 * 否则清空绘图区的时候，有的地方会清理不到
		 * 因为，此时绘图区域与清理区域没有完全重合
		 */
		this.ctx.translate(this.offset.x,this.offset.y);//使绘图区域与清理区域没有完全重合
		
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
		for (let obj of this.cellList) {
			if (this.isCursorInObj(obj)) {
				this.selectedObj = obj;
			}
		}

		for (let obj of this.roadList) {
			if (this.isCursorInObj(obj)) {
				this.selectedObj = obj;
			}
		}
	}

	private isCursorInObj(currObj: any): boolean {
		//如果是道路，先转换成矩形区域
		let obj: any = {};
		Object.assign(obj, currObj);
		if (currObj instanceof Road) {
			let x: number,y: number, w: number, h: number;
			if (obj.y === obj.ey) {
				x = obj.x;
				y = obj.y - obj.w / 2;
				w = Math.abs(obj.ex - obj.x);
				h = obj.w;
			} else if (obj.x === obj.ex) {
				x = obj.x - obj.w / 2;
				y = obj.y;
				w = obj.w;
				h = Math.abs(obj.ey - obj.y);
			}

			let rx = (obj.x + obj.ex) / 2;
			let ry = (obj.y + obj.ey) / 2 ;

			obj = new Cell(x, y, w, h, rx, ry, 0);
		}
		//先求出旋转后被选择对象各个点的坐标
		//对角线的一半
		let halfDiagonal: number = Math.sqrt(Math.pow(obj.w, 2) + Math.pow(obj.h, 2)) / 2;
		//旋转前，对角线与X轴的夹角
		let fi: number = Math.atan( obj.h / obj.w );

		//当旋转角deg与fi之和小于90°时
		//四个角按照上右下左的顺序
		let addDirectionX1 = 1;
		if (obj.deg * Math.PI + fi < Math.PI / 2) {//obj.deg千万别忘了Math.PI
			addDirectionX1 = -1;
		} else {
			addDirectionX1 = 1;
		}
		let x1: number = obj.x + (obj.w / 2 + halfDiagonal * Math.abs(Math.cos(obj.deg * Math.PI + fi)) * addDirectionX1);

		let addDirectionY1 = 1;
		if (obj.deg * Math.PI > Math.PI - fi) {
			addDirectionY1 = 1;
		} else {
			addDirectionY1 = -1;
		}
		let y1: number = obj.y + (obj.h / 2 + halfDiagonal * Math.abs(Math.sin( obj.deg * Math.PI + fi)) * addDirectionY1);

		let addDirectionX2 = 1;
		if (obj.deg * Math.PI < Math.PI / 2 + fi) {
			addDirectionX2 = -1;
		} else {
			addDirectionX2 = 1;
		}
		let x2: number = (obj.x + obj.w) - (obj.w / 2 + halfDiagonal * Math.abs(Math.cos( fi - obj.deg * Math.PI )) * addDirectionX2);

		let addDirectionY2 = 1;
		if (obj.deg * Math.PI < fi ) {
			addDirectionY2 = -1;
		} else {
			addDirectionY2 = 1;
		}
		let y2: number = obj.y + (obj.h / 2 + halfDiagonal * Math.abs(Math.sin( fi - obj.deg * Math.PI )) * addDirectionY2);

		let addDirectionX3 = 1;
		if (obj.deg * Math.PI < Math.PI / 2 -fi) {
			addDirectionX3 = -1
		} else {
			addDirectionX3 = 1;
		}
		let x3: number = (obj.x + obj.w) - (obj.w / 2 + halfDiagonal * Math.abs(Math.cos(obj.deg * Math.PI + fi)) * addDirectionX3);

		let addDirectionY3 = 1;
		if (obj.deg * Math.PI > Math.PI - fi) {
			addDirectionY3 = 1;
		} else {
			addDirectionY3 = -1;
		}
		let y3: number = (obj.y + obj.h) - (obj.h / 2 + halfDiagonal * Math.abs(Math.sin( obj.deg * Math.PI + fi)) * addDirectionY3);

		let addDirectionX4 = 1;
		if (obj.deg * Math.PI < Math.PI / 2 + fi) {
			addDirectionX4 = -1;
		} else {
			addDirectionX4 = 1;
		}
		let x4: number = obj.x + (obj.w / 2 + halfDiagonal * Math.abs(Math.cos( fi - obj.deg * Math.PI )) * addDirectionX4);

		let addDirectionY4 = 1;
		if (obj.deg * Math.PI < fi ) {
			addDirectionY4 = -1;
		} else {
			addDirectionY4 = 1;
		}
		let y4: number = (obj.y + obj.h) - ( obj.h / 2 + halfDiagonal * Math.abs(Math.sin( fi - obj.deg * Math.PI )) * addDirectionY4);

		let points: Array<Point> = [
			new Point(x1, y1),
			new Point(x2, y2),
			new Point(x3, y3),
			new Point(x4, y4),
		];
		return this.isInsidePolygon(this.cursor, points);
	}


	private isInsidePolygon(pt: Point, poly: Array<Point>) { 
		let c: boolean = false;
		for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 

			((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) 

			&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) 

			&& (c = !c); 

		return c; 

	} 


	private ifInPolygon(points:any, x: number, y: number) {
		//假设射线线是向x轴正方向发射的
		let crossNum = 0;
		for (let i = 0; i < points.length - 1; i++) {
			//斜率为0
			if (points[i].y === points[i + 1].y) {
				if ((y === points[i].y) && 
					(x >= this.min(points[i].x, points[i+1].x)) &&
					(x <= this.max(points[i].x, points[i+1].x))) {
					return true;
				}
			}

			//斜率为1
			if (points[i].x === points[i + 1].x) {
				if ((x <= points[i].x ) &&
					(y >= this.min(points[i].y, points[i+1].y)) &&
					(y <= this.max(points[i].y, points[i+1].y))) {
					crossNum++;
				}
			}

			//其它斜率
			let crossX: number = (y - points[i].y) * (points[i + 1].x - points[i].x) / (points[i + 1].y - points[i].y) + points[i].x;
			//交叉点，就是鼠标当前点
			if ((crossX >= x) && (crossX > this.min(points[i].x, points[i + 1].x)) &&
				(crossX < this.max(points[i].x, points[i + 1].x))) {
				crossNum++;//这里crossX等于points[i],或points[i+1]时，不处理，处理也是crossNum+=2,相交于顶点，算两个
			}
		}
		
		if (crossNum % 2 === 1) {
			return true;
		}
		return false;
	}

	private max(a: number, b: number): number {
		if (a > b) {
			return a;
		} else {
			return b;
		}
	}

	private min(a: number, b: number): number {
		if (a < b) {
			return a;
		} else {
			return b;
		}
	}

	/**
	 * 鼠标移动事件处理
	 */
	@HostListener('mousemove', ['$event']) private onMouseMove(ev) {
		if (this.isMouseDown) {
			if (!this.isSpaceDown && !this.isKeySDown || 
				this.isSpaceDown && this.isKeySDown) {//拖拽地图，整体移动
				this.locStatus.x -= ev.movementX;
				this.locStatus.y -= ev.movementY;
				//累加坐标原点相对于整幅地图原点的偏移量
				this.offset.x += ev.movementX;
				this.offset.y += ev.movementY;
				//累加窗口左上角，相对整幅地图原点的总偏移量
				this.topLeft.x -= ev.movementX;
				this.topLeft.y -= ev.movementY;

				this.ctx.translate(ev.movementX, ev.movementY);
			} else if (this.isSpaceDown){//拖拽单个对象
				//判断鼠标是否点中对象
				if (this.selectedObj) {
					if (this.isCursorInObj(this.selectedObj)) {
						if (this.selectedObj instanceof Cell) {
							this.selectedObj.x += ev.movementX;
							this.selectedObj.y += ev.movementY;
							this.selectedObj.rx += ev.movementX;
							this.selectedObj.ry += ev.movementY;
						} else if (this.selectedObj instanceof Road) {
							this.selectedObj.x += ev.movementX;
							this.selectedObj.y += ev.movementY;
							this.selectedObj.ex += ev.movementX;
							this.selectedObj.ey += ev.movementY;
						}
				
					}
				}

			} else if (this.isKeySDown) {//缩放当个对象
				if (this.selectedObj) {
					//缩放得乘以旋转角度！！！！
					if (this.selectedObj.w > 10) {
						this.selectedObj.w += ev.movementX;
						//旋转中心也得随着变动
						this.selectedObj.rx += ev.movementX / 2;
					} else if (ev.movementX > 0) {
						this.selectedObj.w += ev.movementX;
						//旋转中心也得随着变动
						this.selectedObj.rx += ev.movementX / 2;
					}

					if (this.selectedObj.h > 10) {
						this.selectedObj.h += ev.movementY;
						this.selectedObj.ry += ev.movementY / 2;
					} else if (ev.movementY > 0) {//小于或等于10时，只能放大
						this.selectedObj.h += ev.movementY;
						this.selectedObj.ry += ev.movementY / 2;
					}
				}
			}


			// this.clearMap();

			// this.drawMap();
		}
		/**
		 * 记录鼠标的当前位置,必须放到处理地图拖拽之后
		 * 否则当this.offset.x,this.offset.y变化的时候，
		 * 不能把变化量累加到this.cursor.x,this.cursor.y
		 * 从而导致，当拖拽地图后，鼠标不能准确的点中
		 * 要拖拽的对象，使对象不能拖拽
		 */
		//计算鼠标相对于整幅地图原点的坐标
		this.cursor.x = this.topLeft.x + ev.layerX;
		this.cursor.y = this.topLeft.y + ev.layerY;
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
					if (this.selectedObj) {
						this.selectedObj.deg += 0.0375;
						//对于简单的矩形而言，当deg大于1(180°),就进入循环了
						if (this.selectedObj.deg >= 1) {
							this.selectedObj.deg -= 1;
						}
						this.clearMap();
						this.drawMap();
					}
				}
				break;
			case 'KeyD':
				{
					if (this.selectedObj) {
						this.selectedObj.deg -= 0.0375;
						if ( this.selectedObj.deg < 0) {
							this.selectedObj.deg += 1;
						}
						this.clearMap();
						this.drawMap();
					}

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
		this.ctx.clearRect(-this.offset.x,-this.offset.y,this.el.nativeElement.clientWidth,this.el.nativeElement.clientHeight);
	}

	/**
	 * 画图
	 */
	private drawMap() {
		this.ctx.fillStyle = '#000000';
		this.ctx.fillText(`X:${this.cursor.x} | Y:${this.cursor.y}`,this.locStatus.x,this.locStatus.y);
		this.ctx.fillStyle = '#ff0000';
		this.drawCells();
		this.drawRoads(this.roadList);
	}

	/**
	 * 画车位
	 */
	private drawCells() {
		for (let obj of this.cellList) {
			this.ctx.save();
			this.ctx.translate(obj.rx, obj.ry);
			this.ctx.rotate(Math.PI*obj.deg);
			this.ctx.translate(-obj.rx, -obj.ry);
			this.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
			this.ctx.restore();
		}

		// this.ctx.setFillStyle('green');
		// this.ctx.setFontSize(30);
		// for (let cell of cellList) {
		//     this.ctx.setFillStyle('green');
		//     this.ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
		//     this.ctx.setFillStyle('black');
		//     this.ctx.fillText(cell.num.text, cell.num.x, cell.num.y);

		// }
	}

	/**
	 * 画道路
	 */
	private drawRoads (roadList: Array<Road>) {
	    this.ctx.strokeStyle = 'blue';
	    this.ctx.beginPath();//只写了这个，才能重绘道路，不然会有重影
	    for (let road of roadList) {
	        this.ctx.lineWidth = road.w;
	        this.ctx.moveTo(road.x, road.y);
	        this.ctx.lineTo(road.ex, road.ey);
	        // this.ctx.stroke();//这句代码不能放在这里，否则线条的透明不不一致，
	    }
	    this.ctx.stroke();//放在这里才能保证画出的线条的透明度一致
	    this.ctx.closePath();
	    // this.ctx.draw();
	}

	/**
	 * 画立柱
	 */
	// private drawCylinders(cylinderList) {
	//     // this.ctx.beginPath();
	//     this.ctx.setFillStyle('green');
	//     for (let cylinder of cylinderList) {
	//         this.ctx.beginPath();
	//         this.ctx.arc(cylinder.x,cylinder.y,cylinder.r,0,2 * Math.PI);
	//         this.ctx.fill();
	//     }
	// }



	/**
	 * 重绘鼠标位置状态
	 */
	// private drawCursorLoc() {
	// 	this.ctx.save();
	// 	this.ctx.fillStyle = '#000000';
	// 	this.ctx.fillText(`X:${this.cursor.x} | Y:${this.cursor.y}`,this.locStatus.x,this.locStatus.y);
	// 	this.ctx.fillStyle = '#ff0000';
	// 	this.ctx.restore();
	// }

	ngOnDestroy() {

	}

}