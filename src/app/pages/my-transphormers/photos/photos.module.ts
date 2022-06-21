import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PhotosPage } from './photos.page';
import { ProgressUpdateModule } from '../../../components/progress-update/progress-update.module';

const routes: Routes = [
  {
    path: '',
    component: PhotosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProgressUpdateModule
  ],
  declarations: [PhotosPage],
})
export class PhotosPageModule {
}
