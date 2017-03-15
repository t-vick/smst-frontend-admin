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
		this.ctx.fillRect(0,0,150,75);
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
			this.ctx.translate(this.offsetX, this.offsetY);
			this.ctx.clearRect(-this.offsetX,-this.offsetY,400,300);//清空画布
			this.ctx.fillRect(0,0,150,75);
		}
	}

	@HostListener('mouseup') onMouseUp() {
		this.isMouseDown = false;
	}
}