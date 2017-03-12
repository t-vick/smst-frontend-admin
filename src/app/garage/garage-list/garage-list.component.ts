import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { GarageAddComponent } from '../garage-add/garage-add.component';

@Component({
	moduleId: module.id,
	selector: 'garage-list',
	templateUrl: './garage-list.component.html',
	styleUrls: ['./garage-list.component.css'],
})
export class GarageListComponent {
	data = [
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		},
		{
			name:'t-vick',
			email:'t-vick@msn.com',
			age: 18,
			city: 'liuyang'
		}
	]

	constructor(private dialog: MdDialog){}

	openDialog() {
		let dialogRef = this.dialog.open(GarageAddComponent);
		dialogRef.afterClosed().subscribe(result => {

		});
	}
}