import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MetricsPage } from './metrics.page';
import { ChartModule } from '../../../components/chart/chart.module';

const routes: Routes = [
  {
    path: '',
    component: MetricsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChartModule
  ],
  declarations: [MetricsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MetricsPageModule {
}
