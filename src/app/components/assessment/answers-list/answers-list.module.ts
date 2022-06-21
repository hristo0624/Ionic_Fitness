import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswersListComponent } from './answers-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AnswersListComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [AnswersListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnswersListModule {
}
