import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacrosBarComponent } from './macros-bar/macros-bar.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { IonicModule } from '@ionic/angular';
import { AssessmentViewComponent } from './assessment-view/assessment-view.component';
import { AnswersListModule } from './assessment/answers-list/answers-list.module';
import { NutritionDetailModule } from './nutrition-detail/nutrition-detail.module';
import { ProgressComparisonModule } from './progress-comparison/progress-comparison.module';
import { WorkoutModule } from './workout/workout.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AnswersListModule,
    NutritionDetailModule,
    ProgressComparisonModule,
    WorkoutModule
  ],
  declarations: [
    MacrosBarComponent,
    VideoPlayerComponent,
    AssessmentViewComponent,
  ],
  exports: [
    MacrosBarComponent,
    VideoPlayerComponent,
    AssessmentViewComponent,
  ]
})
export class AppComponentsModule {
}
