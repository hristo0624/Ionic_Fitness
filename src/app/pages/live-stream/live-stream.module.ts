import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LiveStreamPage } from './live-stream.page';
import { AutoresizeModule } from '../../directives/autoresize/autoresize.module';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    AutoresizeModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SideMenuModule,
    AppComponentsModule
  ],
  declarations: [LiveStreamPage]
})
export class LiveStreamPageModule {}
