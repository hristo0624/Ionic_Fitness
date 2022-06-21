import { HeightModule } from './../../components/height/height.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InfoGatheringPage } from './info-gathering.page';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import { MarketingQuestionsComponent } from './components/marketing-questions/marketing-questions.component';

const routes: Routes = [{
  path: '',
  component: InfoGatheringPage
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HeightModule
  ],
  declarations: [InfoGatheringPage, PersonalInfoComponent, BasicInfoComponent, MarketingQuestionsComponent],
  exports: [PersonalInfoComponent, BasicInfoComponent, MarketingQuestionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InfoGatheringPageModule {
}
