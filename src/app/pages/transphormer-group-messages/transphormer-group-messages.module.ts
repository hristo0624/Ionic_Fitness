import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransphormerGroupMessagesPage } from './transphormer-group-messages.page';

const routes: Routes = [
  {
    path: '',
    component: TransphormerGroupMessagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransphormerGroupMessagesPage]
})
export class TransphormerGroupMessagesPageModule {
}
