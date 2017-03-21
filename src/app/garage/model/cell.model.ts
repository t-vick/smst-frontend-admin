/**
 * 车位模型
 */
export class Cell {
	public x: number;
	public y: number; 
	public w: number; 
	public h: number;
	public rx: number;
	public ry: number;
	public deg: number;
	constructor({x, y, w, h, rx, ry, deg}){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.rx = rx;
		this.ry = ry;
		this.deg = deg;
	}
}