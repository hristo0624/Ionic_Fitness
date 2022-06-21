import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VideoPlayerPage } from './video-player.page';
import { LogoModule } from '../../components/logo/logo.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: VideoPlayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppComponentsModule,
    IonicModule,
    LogoModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VideoPlayerPage]
})
export class VideoPlayerPageModule {}
