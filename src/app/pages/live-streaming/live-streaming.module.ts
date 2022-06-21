import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule, IonRefresher } from '@ionic/angular';
import { LiveStreamingPage } from './live-streaming.page';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { AutoresizeModule } from '../../directives/autoresize/autoresize.module';
import { LogoModule } from '../../components/logo/logo.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    AutoresizeModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SafeUrlModule,
    LogoModule,
    ReactiveFormsModule,
    SideMenuModule,
    AppComponentsModule
  ],
  declarations: [LiveStreamingPage],
  entryComponents: [],
  providers: [InAppBrowser, IonRefresher]
})
export class LiveStreamingPageModule {
}
