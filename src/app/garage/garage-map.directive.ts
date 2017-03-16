import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements AfterViewInit{
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;
	private oldX: number = 0;
	private oldY: number = 0;
	private offsetX: number = 0;
	private offsetY: number = 0;

	constructor(private el: ElementRef){
		this.ctx=this.el.nativeElement.getContext("2d");
	};

	ngAfterViewInit() {
		this.ctx.canvas.setAttribute('height',this.el.nativeElement.clientHeight);//必须先设置高度？
		this.ctx.canvas.setAttribute('width',this.el.nativeElement.clientWidth);

		
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.globalAlpha = 0.3;

		this.ctx.fillStyle = '#ff0000';
		this.ctx.fillRect(0,0,75,75);
	}

	@HostListener('mousedown', ['$event']) onMouseDown(ev) {
		this.oldX = ev.layerX;
		this.oldY = ev.layerY;
		this.isMouseDown = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(ev) {
		if (this.isMouseDown) {
			// this.offsetX = ev.layerX - this.oldX;
			// this.offsetY = ev.layerY - this.oldY;
			// this.oldX = ev.layerX;
			// this.oldY = ev.layerY;
			// this.ctx.translate(this.offsetX, this.offsetY);//调节鼠标灵敏度，3.7时图像刚好跟随鼠标动作
			this.ctx.translate(ev.movementX, ev.movementY);
			this.ctx.clearRect(-ev.movementX,-ev.movementY,this.el.nativeElement.clientWidth,this.el.nativeElement.clientHeight);//清空画布及其周围100像素以内的元素
			this.ctx.fillRect(0,0,75,75);
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