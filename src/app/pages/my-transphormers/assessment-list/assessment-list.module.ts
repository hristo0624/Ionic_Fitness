import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProgressUpdateModule } from '../../../components/progress-update/progress-update.module';
import { InfoBitComponent } from '../../../components/info-bit/info-bit.component';
import { AppComponentsModule } from '../../../components/common-components.module';
import { AssessmentListPage } from './assessment-list.page';
import { SideMenuModule } from '../../../components/side-menu/side-menu.module';

const routes: Routes = [
  {
    path: '',
    component: AssessmentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProgressUpdateModule,
    AppComponentsModule,
    SideMenuModule
  ],
  declarations: [AssessmentListPage]
})
export class AssessmentListPageModule {
}
