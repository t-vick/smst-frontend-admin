import { Component, ViewChild } from '@angular/core';

import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
	moduleId: module.id,
	selector: 'layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
	tiles = [
	  {text: 'One', cols: 5, rows: 1, color: 'lightblue'},
	  {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
	  {text: 'Three', cols: 4, rows: 2, color: 'lightpink'},
	];

	@ViewChild(SidebarComponent) child: SidebarComponent;

}