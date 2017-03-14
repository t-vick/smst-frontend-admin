import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { DataTableModule } from "angular2-datatable";

import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageAddComponent } from './garage-add/garage-add.component';

import { GarageRoutingModule } from './garage-routing.module';
@NgModule({
	declarations: [
		GarageListComponent,
		GarageAddComponent,
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		MaterialModule,
		DataTableModule,
		GarageRoutingModule,
	],
	exports: [
		GarageListComponent,
	],
	entryComponents: [ GarageAddComponent ]
})
export class GarageModule {

}