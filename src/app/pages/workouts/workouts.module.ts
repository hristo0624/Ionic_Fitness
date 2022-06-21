import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WorkoutsPage } from './workouts.page';
import { TrackerComponent } from './tracker/tracker.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { WorkoutHistoryComponent } from './workout-history/workout-history.component';
import { BottomMenuModule } from '../../components/bottom-menu/bottom-menu.module';
import { WorkoutsInfoComponent } from './workouts-info/workouts-info.component';
import { LogoModule } from '../../components/logo/logo.module';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { SideMenuModule } from '../../components/side-menu/side-menu.module';
import { CalendarModule } from '../../components/calendar/calendar.module';

const routes: Routes = [
  {
    path: '',
    component: WorkoutsPage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    LogoModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule,
    BottomMenuModule,
    SideMenuModule
  ],
  declarations: [WorkoutsPage, TrackerComponent, AddNoteComponent, WorkoutHistoryComponent, WorkoutsInfoComponent],
  entryComponents: [TrackerComponent, AddNoteComponent, WorkoutHistoryComponent,
    WorkoutsInfoComponent]
})
export class WorkoutsPageModule {
}
