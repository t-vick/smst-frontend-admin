import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
	selector: '[garageMap]',

})
export class GarageMapDirective implements OnInit{
	@Input('garageMap')
	private mapOption: Object;
	private ctx: any;
	private isMouseDown: boolean = false;
	private mouseDownX: number = 0;
	private mouseDownY: number = 0;
	private test = {
		x:0,
		y:0,
		xLoc:0,
		yLoc:0
	}
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
		this.mouseDownX = ev.clientX;
		this.mouseDownY = ev.clientY;
		this.isMouseDown = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(ev) {
		if (this.isMouseDown) {
			this.test.x = this.mouseDownX;
			this.test.y = this.mouseDownY;
			this.test.xLoc += ev.clientX - this.test.x;
			this.test.yLoc += ev.clientY - this.test.y;
			this.ctx.translate(this.test.xLoc/1000, this.test.yLoc/1000);
			this.ctx.clearRect(0,0,400,300);
			this.ctx.fillRect(0,0,150,75);
		}
		// console.log(ev);
		// console.log(this.mapOption);
	}

	@HostListener('mouseup') onMouseUp() {
		this.isMouseDown = false;
	}

	@HostListener('mousedrag', ['$event']) onDragStart(ev) {
		this.test.x = ev.clientX;
		console.log(ev);
	}
}