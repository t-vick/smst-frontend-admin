import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { DataTableModule } from "angular2-datatable";

import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageMapComponent } from './garage-map/garage-map.component';
import { GarageAddComponent } from './garage-add/garage-add.component';

import { GarageMapDirective } from './garage-map.directive';

import { GarageRoutingModule } from './garage-routing.module';
@NgModule({
	declarations: [
		GarageListComponent,
		GarageMapComponent,
		GarageAddComponent,
		GarageMapDirective
	],
	imports: [
		CommonModule,
		FormsModule,
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