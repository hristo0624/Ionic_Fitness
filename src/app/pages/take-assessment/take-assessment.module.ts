import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TakeAssessmentPage } from './take-assessment.page';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { PhotoReviewComponent } from './components/photo-review/photo-review.component';
import { SummaryComponent } from './components/summary/summary.component';
import { QuestionAnswerPipe } from './pipes/question-answer.pipe';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { AssessmentSummaryGuard } from '../../guards/assessment-summary/assessment-summary.guard';
import { AssessmentCommonModule } from '../../components/assessment-common/assessment-common.module';
import { IntroComponent } from './components/intro/intro.component';
import { AssessmentIntroGuard } from '../../guards/assessment-intro/assessment-intro.guard';

const routes: Routes = [
  {
    path: '',
    component: TakeAssessmentPage,
    canActivate: [AssessmentIntroGuard]
  },
  { path: 'intro',
    component: IntroComponent
  },
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [AssessmentSummaryGuard]
  },
  {
    path: 'thank-you',
    component: ThankYouComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SideMenuModule,
    AssessmentCommonModule
  ],
  declarations: [
    TakeAssessmentPage,
    PhotoReviewComponent,
    IntroComponent,
    SummaryComponent,
    QuestionAnswerPipe,
    ThankYouComponent
  ]
})
export class TakeAssessmentPageModule {
}
