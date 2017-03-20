/**
 * 车位模型
 */
export class Cell {
	constructor(
		public x: number, 
		public y: number, 
		public w: number, 
		public h: number,
		public rotateX: number,
		public rotateY: number,
		public deg: number){
	}
}