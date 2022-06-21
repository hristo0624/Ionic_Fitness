import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NutritionPage } from './nutrition.page';
import { PickItemComponent } from './pick-item/pick-item.component';
import { MealInfoComponent } from './meal-info/meal-info.component';
import { MacroComponent } from './macro/macro.component';
import { PieChartModule } from '../../components/pie-chart/pie-chart.module';
import { PortionControlComponent } from './portion-control/portion-control.component';
import { CalorieCountingComponent } from './calorie-counting/calorie-counting.component';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { CalendarModule } from '../../components/calendar/calendar.module';
import { FoodGuideComponent } from './food-guide/food-guide.component';

const routes: Routes = [
  {
    path: '',
    component: NutritionPage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule,
    PieChartModule,
    SafeUrlModule,
    SideMenuModule
  ],
  declarations: [NutritionPage, PickItemComponent, MacroComponent, MealInfoComponent,
    PortionControlComponent, CalorieCountingComponent, FoodGuideComponent],
  entryComponents: [PickItemComponent, MealInfoComponent, FoodGuideComponent],
  providers: [InAppBrowser]
})
export class NutritionPageModule {
}
