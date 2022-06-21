import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SubscriptionPage } from './subscription.page';
import { LogoModule } from '../../components/logo/logo.module';
// import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LogoModule,
    SideMenuModule
  ],
  declarations: [SubscriptionPage],
  providers: [
    InAppPurchase2,
    InAppBrowser
  ]
})
export class SubscriptionPageModule {
}
