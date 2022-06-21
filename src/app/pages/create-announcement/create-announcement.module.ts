import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CreateAnnouncementPage } from './create-announcement.page';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { FilterModule } from '../../components/filter/filter.module';
import { FilterComponent } from '../../components/filter/filter.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAnnouncementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SideMenuModule,
    FilterModule
  ],
  declarations: [CreateAnnouncementPage],
  entryComponents: [FilterComponent]
})
export class CreateAnnouncementPageModule {
}
