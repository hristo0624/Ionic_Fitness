import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainerRequestComponent } from './trainer-request/trainer-request.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerApplicationComponent } from './trainer-application/trainer-application.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';
import { LabelValueItemComponent } from '../label-value-item/label-value-item.component';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  declarations: [TrainerRequestComponent, TrainerApplicationComponent, TrainerProfileComponent, LabelValueItemComponent],
  exports: [TrainerApplicationComponent, TrainerRequestComponent, TrainerProfileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrainerLinkingModule {
}
