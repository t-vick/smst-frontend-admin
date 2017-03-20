/**
 * 车位模型
 */
export class Cell {
	constructor(
		public x: number, 
		public y: number, 
		public w: number, 
		public h: number,
		public rx: number,
		public ry: number,
		public deg: number){
	}
}