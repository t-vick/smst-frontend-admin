import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { AppRoutingModule } from '../app-routing.module';

import { ConfigService } from './config.service';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
	imports: [ FlexLayoutModule, MaterialModule, AppRoutingModule ],
	declarations: [ LayoutComponent, SidebarComponent ],
	exports: [ LayoutComponent ],
	providers: [ ConfigService ],
})
export class CoreModule {}