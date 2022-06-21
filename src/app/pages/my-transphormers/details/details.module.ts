import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetailsPage } from './details.page';
import { ProgressUpdateModule } from '../../../components/progress-update/progress-update.module';
import { InfoBitComponent } from '../../../components/info-bit/info-bit.component';
import { AppComponentsModule } from '../../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProgressUpdateModule,
    AppComponentsModule
  ],
  declarations: [DetailsPage, InfoBitComponent]
})
export class DetailsPageModule {
}
