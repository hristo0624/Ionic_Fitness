import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatMessagesPage } from './chat-messages.page';
import { AutoresizeModule } from '../../directives/autoresize/autoresize.module';

const routes: Routes = [
  {
    path: '',
    component: ChatMessagesPage
  }
];

@NgModule({
  imports: [
    AutoresizeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [ChatMessagesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatMessagesPageModule {
}
