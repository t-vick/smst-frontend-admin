import { Component } from '@angular/core';

import { MdDialogRef } from '@angular/material';

@Component({
	moduleId: module.id,
	selector: 'garage-add',
	templateUrl: './garage-add.component.html',
	styleUrls: ['./garage-add.component.css']
})
export class GarageAddComponent {
	constructor(private dialogRef: MdDialogRef<GarageAddComponent>){}
}