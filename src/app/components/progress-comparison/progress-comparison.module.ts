import { ProgressComparisonComponent } from './progress-comparison.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ZoomImgModule } from '../zoom-img/zoom-img.module';
import { ZoomImgComponent } from '../zoom-img/zoom-img.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ZoomImgModule
  ],
  declarations: [ProgressComparisonComponent],
  exports: [ProgressComparisonComponent],
  entryComponents: [ZoomImgComponent],
  providers: [InAppBrowser]
})
export class ProgressComparisonModule {
}
