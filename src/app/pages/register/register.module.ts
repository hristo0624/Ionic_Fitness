import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page';
import { TermsComponent } from './terms/terms.component';
import { LogoModule } from '../../components/logo/logo.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    LogoModule
  ],
  declarations: [RegisterPage, TermsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TermsComponent]
})
export class RegisterPageModule {
}
