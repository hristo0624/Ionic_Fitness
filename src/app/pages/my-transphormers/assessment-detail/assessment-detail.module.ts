import { ProgressComparisonModule } from './../../../components/progress-comparison/progress-comparison.module';
import { AnswersListModule } from './../../../components/assessment/answers-list/answers-list.module';
import { AssessmentDetailPage } from './assessment-detail.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppComponentsModule } from '../../../components/common-components.module';
import { NutritionDetailModule } from '../../../components/nutrition-detail/nutrition-detail.module';
import { ChartModule } from '../../../components/chart/chart.module';
import { WorkoutModule } from '../../../components/workout/workout.module';

const routes: Routes = [
  {
    path: '',
    component: AssessmentDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppComponentsModule,
    ReactiveFormsModule,
    AnswersListModule,
    ProgressComparisonModule,
    NutritionDetailModule,
    ChartModule,
    WorkoutModule
  ],
  declarations: [AssessmentDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AssessmentDetailPageModule {
}
