import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageMapComponent } from './garage-map/garage-map.component';
const routes: Routes = [
	{
		path: 'garage-list',
		component: GarageListComponent,
	},
	{
		path: 'garage-map',
		component: GarageMapComponent,
	},
	{
		path: '',
		redirectTo: 'garage-list',
		pathMatch: 'full',
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class GarageRoutingModule {}