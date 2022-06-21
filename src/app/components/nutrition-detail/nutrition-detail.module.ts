import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ZoomImgModule } from '../zoom-img/zoom-img.module';
import { ZoomImgComponent } from '../zoom-img/zoom-img.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NutritionDetailComponent } from './nutrition-detail.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ZoomImgModule
  ],
  declarations: [NutritionDetailComponent],
  exports: [NutritionDetailComponent],
  entryComponents: [ZoomImgComponent],
  providers: [InAppBrowser]
})
export class NutritionDetailModule {
}
