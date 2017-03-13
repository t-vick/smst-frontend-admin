import {Component, ViewEncapsulation, ViewChild } from '@angular/core';

import { MdSidenav } from '@angular/material';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
	@ViewChild( MdSidenav ) sidenav:MdSidenav;

}