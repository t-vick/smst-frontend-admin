import {Component, ViewEncapsulation, ViewChild } from '@angular/core';

import { MdSidenav } from '@angular/material';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
	encapsulation: ViewEncapsulation.None,//组件样式封装，None:可进可出；Emulated:可进不可出；Native不进不出
})
export class SidebarComponent {
	@ViewChild( MdSidenav ) sidenav:MdSidenav;

}