import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GarageListComponent } from './garage-list/garage-list.component';
const routes: Routes = [
	{
		path: '',
		component: GarageListComponent,
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class GarageRoutingModule {}