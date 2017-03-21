import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Cell } from '../model/cell.model';
import { Road } from '../model/road.model';
import { ObjData } from '../model/obj-data.model';

@Component({
	moduleId: module.id,
	selector: 'garage-obj-add',
	templateUrl: './garage-obj-add.component.html',
	styleUrls: ['./garage-obj-add.component.css']
})
export class GarageObjAddComponent {
	selectedValue: string = 'road';
	objData: ObjData = new ObjData({
		x: 0, 
		y: 100, 
		ex: 100, 
		ey: 100,
		w: 50,
		h: 100, 
		lw: 20, 
		deg: 0,
		rx: 50, 
		ry: 100, 
		hl: 50
	});

	types = [
	  {value: 'road', viewValue: '道路'},
	  {value: 'cylinder', viewValue: '立柱'},
	  {value: 'cell', viewValue: '车位'}
	];
	constructor(private dialogRef: MdDialogRef<GarageObjAddComponent>){}

	selectChanged(ev){
		console.log(ev);
		console.log(this.selectedValue);
		switch (this.selectedValue) {
			case 'road': 
				{
					// this.objData = new Road({
					// 	x: 0, 
					// 	y: 100, 
					// 	ex: 100, 
					// 	ey: 100, 
					// 	lw: 20, 
					// 	rx: 50, 
					// 	ry: 100, 
					// 	hl: 50,
					// 	deg: 0
					// });
				}
				break;
			case 'cylinder':
				{

				}
				break;
			case 'cell': 
				{

				}
				break;
			default: 
				break;
		}
		console.log(this.objData);
	}
}