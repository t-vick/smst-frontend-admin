import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements OnInit{
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;
	private oldX: number = 0;
	private oldY: number = 0;
	private offsetX: number = 0;
	private offsetY: number = 0;

	constructor(private el: ElementRef){
		this.ctx=el.nativeElement.getContext("2d");
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.globalAlpha = 0.3;

		this.ctx.fillStyle = '#ff0000';
		this.ctx.fillRect(0,0,75,75);
		el.nativeElement.addEventListener('ondragstart',function(ev){
			console.log(ev);
		})
		console.log(this.ctx);
		console.log(el);
	};

	ngOnInit() {
		console.log(this.mapOption);
	}

	@HostListener('mousedown', ['$event']) onMouseDown(ev) {
		this.oldX = ev.clientX;
		this.oldY = ev.clientY;
		this.isMouseDown = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(ev) {
		if (this.isMouseDown) {
			this.offsetX = ev.clientX - this.oldX;
			this.offsetY = ev.clientY - this.oldY;
			this.oldX = ev.clientX;
			this.oldY = ev.clientY;
			this.ctx.translate(this.offsetX/3.7, this.offsetY/3.7);//调节鼠标灵敏度，3.7时图像刚好跟随鼠标动作
			this.ctx.clearRect(-this.offsetX-100,-this.offsetY-100,this.el.nativeElement.clientWidth + 100,this.el.nativeElement.clientHeight+100);//清空画布及其周围100像素以内的元素
			this.ctx.fillRect(0,0,75,75);
		}
		console.log(this.ctx);
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