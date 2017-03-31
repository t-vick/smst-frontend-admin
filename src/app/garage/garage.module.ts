import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { DataTableModule } from "angular2-datatable";

import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageMapComponent } from './garage-map/garage-map.component';
import { GarageAddComponent } from './garage-add/garage-add.component';
import { GarageObjAddComponent } from './garage-obj-add/garage-obj-add.component';

import { GarageMapDirective } from './garage-map.directive';

import { GarageRoutingModule } from './garage-routing.module';

import { GarageMapService } from './garage-map/garage-map.service';
@NgModule({
	declarations: [
		GarageListComponent,
		GarageMapComponent,
		GarageAddComponent,
		GarageObjAddComponent,
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
	entryComponents: [ 	GarageAddComponent,
						GarageObjAddComponent,
	],
	providers: [GarageMapService]
})
export class GarageModule {

}