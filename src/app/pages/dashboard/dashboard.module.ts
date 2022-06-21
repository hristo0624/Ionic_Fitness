import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { LogsComponent } from './logs/logs.component';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { BottomMenuModule } from '../../components/bottom-menu/bottom-menu.module';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { ProfileCompleteGuard } from '../../guards/profile-complete.guard';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ContestWidgetModule } from '../../components/contest-widget/contest-widget.module';
import { DashboardComponentsModule } from '../../components/dashboard-components/dashboard-components.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    canActivate: [ProfileCompleteGuard],
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SideMenuModule,
    BottomMenuModule,
    SafeUrlModule,
    ContestWidgetModule,
    DashboardComponentsModule,
    AppComponentsModule
  ],
  declarations: [DashboardPage, LogsComponent],
  entryComponents: [LogsComponent],
  providers: [
    LocalNotifications,
    InAppBrowser
  ]
})
export class DashboardPageModule {
}
