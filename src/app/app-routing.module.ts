import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GarageListComponent } from './garage/garage-list/garage-list.component';

const routes: Routes = [
	{
		path: 'garage-list',
		component : GarageListComponent
	},
	{
		path: '',
		redirectTo: 'garage-list',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [
		RouterModule,
	],
})
export class AppRoutingModule{}