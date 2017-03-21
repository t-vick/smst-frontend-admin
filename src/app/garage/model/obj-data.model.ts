/**
 * 地图对象所有数据模型
 */
export class ObjData{
	public x: number;
	public y: number;
	public ex: number;
	public ey: number;
	public w: number;
	public h: number;
	public lw: number;
	public deg: number;
	public rx: number;
	public ry: number;
	public hl: number;
	constructor({ x, y, ex, ey, w, h, lw, deg, rx, ry, hl}){
		this.x = x;
		this.y = y;
		this.ex = ex;
		this.ey = ey;
		this.w = w;
		this.h = h;
		this.lw = lw;
		this.deg = deg;
		this.rx = rx;
		this.ry = ry;
		this.hl = hl; 
	}
}