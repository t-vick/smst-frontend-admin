import { Directive, ElementRef, HostListener, Input, AfterViewInit, OnChanges, SimpleChange } from '@angular/core';

@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements AfterViewInit, OnChanges {
	@Input() size: any;
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;
	private offsetX: number = 0;//绘图区域左上角，相对于初始位置的偏移量
	private offsetY: number = 0;

	constructor(private el: ElementRef){
		this.ctx=this.el.nativeElement.getContext("2d");
	};

	private resize() {
		this.ctx.canvas.setAttribute('height',this.el.nativeElement.clientHeight);//必须先设置高度？
		this.ctx.canvas.setAttribute('width',this.el.nativeElement.clientWidth);
		//调整大小后，要把原点移动到调整大小前的位置
		//否则清空绘图区的时候，有的地方会清理不到
		//因为，此时绘图区域与清理区域没有完全重合
		this.ctx.translate(this.offsetX,this.offsetY);
		
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = '#ff0000';
		this.ctx.fillRect(0,0,75,75);
		this.ctx.save();
		this.ctx.translate(37.5, 37.5);
		this.ctx.rotate(Math.PI/4);
		this.ctx.translate(-37.5, -37.5);
		this.ctx.fillRect(0,0,75,75);
		this.ctx.restore();
		console.log(this.el);
	}

	ngAfterViewInit() {
		if (!this.size) return;
		this.resize();
	}

	ngOnChanges(changes: {[key: string]: SimpleChange}) {
		if (!this.size) return;
		this.resize();
	}

	@HostListener('mousedown', ['$event']) onMouseDown(ev) {
		this.isMouseDown = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(ev) {
		if (this.isMouseDown) {
			this.offsetX += ev.movementX;
			this.offsetY += ev.movementY;
			this.ctx.translate(ev.movementX, ev.movementY);
			this.ctx.clearRect(-this.offsetX,-this.offsetY,this.el.nativeElement.clientWidth,this.el.nativeElement.clientHeight);

			this.ctx.fillRect(0,0,75,75);

			this.ctx.save();
			this.ctx.translate(37.5, 37.5);
			this.ctx.rotate(Math.PI/4);
			this.ctx.translate(-37.5, -37.5);
			this.ctx.fillRect(0,0,75,75);
			this.ctx.restore();
		}
	}

	@HostListener('mouseup') onMouseUp() {
		this.isMouseDown = false;
	}
	/**
	 * 当鼠标移除绘图区时，不在处理鼠标移动事件
	 */
	@HostListener('mouseout') onMouseOut() {
		this.isMouseDown = false;
	}

}