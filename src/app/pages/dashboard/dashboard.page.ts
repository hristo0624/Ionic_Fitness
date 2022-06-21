import { AfterViewChecked, Component, HostListener, Inject, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { SideMenuHandlerEmitter } from '../../components/side-menu/side-menu-handler';
import { DashboardService, DashboardWorkoutSessionInfo } from '../../services/dashboard/dashboard.service';
import { Weight, WeightsService } from '../../services/weights/weights.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { Transphormer } from '../../services/authentication/authentication.service';
import * as moment from 'moment';
import { AccountService, AccountSetting } from '../../services/account/account.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { WorkoutsService } from '../../services/workouts/workouts.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as _ from 'lodash';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { Video, VideosService } from '../../services/videos/videos.service';
import { MacroManagementService } from '../../services/macro-management/macro-management.service';
import { Moment } from 'moment';

export interface WorkoutSummary {
  completed?: boolean;
  day: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewChecked, CanLeaveRoute {
  public workoutSession: DashboardWorkoutSessionInfo;

  public weights: Weight[] = [];

  public challengeDates = [
    {
      start: moment('2019-10-21 00:00:00-06:00'),
      end: moment('2019-12-15 23:59:59-06:00'),
      name: '2019 Fall Sprint Challenge',
      gracePeriodStart: moment('2019-10-21 00:00:00-06:00').clone().subtract(2, 'weeks'),
    },
  ];

  public workoutSummary: WorkoutSummary[];

  public canLeaveAndroidBack = true;
  private debouncedWorkoutUpdates;

  public goalValues = {
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0
  };

  public displayMacros;

  public latestVideo: Video = null;

  constructor(
    protected navCtrl: NavController,
    private dashboardService: DashboardService,
    private weightService: WeightsService,
    private workoutService: WorkoutsService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private videosService: VideosService,
    private iab: InAppBrowser,
    private statusBar: StatusBar,
    private alterController: AlertController,
    private accountService: AccountService,
    private platform: Platform,
    @Inject(RollbarService) private rollbar: Rollbar,
    public macroManagement: MacroManagementService
  ) {
    if (this.transphormer) {
      this.rollbar.configure({
        payload: {
          person: {
            id: this.transphormer.id,
            email: this.transphormer.email,
            paid: this.transphormer.is_paid_user
          }
        }
      });
    }
    this.debouncedWorkoutUpdates = _.debounce(this.setupWorkouts, 15000, {leading: true, trailing: false});
  }

  public get startWeight(): Weight | null {
    if (this.weights.length > 0) {
      return this.weights[this.weights.length - 1];
    }
    return null;
  }

  public get currentWeight(): Weight | null {
    if (this.weights.length > 0) {
      this.weights[0].nice_logged_date = moment(this.weights[0].logged_on).local().format('M/D');
      return this.weights[0];
    }
    return null;
  }

  /**
   * Transphormer object
   */
  public get transphormer(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleLightContent();
      }
    });
    this.setupDashboard();
    this.setupMacros();
    this.setupWorkouts();
    this.fetchLiveVideos();
    this.setupAccountReminders();
    this.sideMenuNavigation();
    this.displayMacros = this.macroManagement.displayMacros(this.transphormer);
  }

  ngAfterViewChecked() {
    this.debouncedWorkoutUpdates();
  }

  public async setupWorkouts() {
    // We want to show "this week" which starts on Monday and ends on Sunday.
    const today = moment().local();
    const dayOfWeek = today.weekday() || 7;
    const firstDay = today.clone().subtract(dayOfWeek - 1, 'day');
    const lastDay = today.clone().add(7 - dayOfWeek, 'day');

    try {
      const recentWorkouts = await this.workoutService.fetchWorkoutSummary(firstDay.toDate(), lastDay.toDate());
      const workoutSummary = [];

      if (Array.isArray(recentWorkouts)) {
        do {
          workoutSummary.push({
            completed: recentWorkouts
              .filter(workout => workout.workout_date === firstDay.format('YYYY-MM-DD'))
              .reduce((a, c) => {
                return a ? a : c.completed;
              }, false),
            future: firstDay.isAfter(today),
            day: firstDay.format('dd')
          });
          firstDay.add(1, 'day');
        }
        while (firstDay <= lastDay);
      }
      if (_.isEqual(this.workoutSummary, workoutSummary)) {
        return;
      }
      this.workoutSummary = workoutSummary;
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public async setupMacros() {
    this.weights = <Weight[]>await this.weightService.listWeights();
    const result = await this.macroManagement.macros(this.transphormer, this.transphormerDoingCalorieMacroCounting, this.currentWeight);
    this.goalValues = result.goalValues;
    this.displayMacros = this.macroManagement.displayMacros(this.transphormer, result.macros, result.meals);
  }

  public get transphormerDoingCalorieMacroCounting() {
    return this.transphormer.likely_to_do === 'Calorie / Macro counting' &&
      this.transphormer.is_paid_user;
  }

  public goToTrainingProgram() {
    this.navCtrl.navigateRoot('workouts', {
      animated: true,
      animationDirection: 'forward'
    });
  }

  private async setupDashboard() {
    try {
      const workout = this.dashboardService.dashboard();
      this.workoutSession = <DashboardWorkoutSessionInfo>await workout;

      // Find the first photo upload that took place no more than two weeks before the start of the challenge.
    } catch (e) {
      const error = this.errorService.firstError(e);

      if (error !== 'No workouts') {
        this.toastSvc.flash(this.errorService.firstError(e));
      }
    }
  }

  public goToBodyMetrics() {
    this.navCtrl.navigateRoot('body-metrics');
  }

  public goToFacebook() {
    this.iab.create('https://www.facebook.com/groups/MyTransPHORMation/', '_system', {location: 'yes'});
  }

  public goToNutrition() {
    const user = <Transphormer>(
      JSON.parse(window.localStorage.getItem('transphormer'))
    );

    if (user.is_paid_user && user.likely_to_do === 'Calorie / Macro counting') {
      this.navCtrl.navigateRoot('macro');
    } else {
      this.navCtrl.navigateRoot('nutrition');
    }
  }

  private async fetchLiveVideos() {
    try {
      this.latestVideo = <Video>await this.videosService.getLatestVideo();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public async videoClick() {
    if (!this.transphormer.is_paid_user) {
      const alert = await this.alterController.create({
        header: 'Go Premium',
        subHeader: 'Live stream is only available for Premium subscribers.',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'danger'
          },
          {
            text: 'Go Premium',
            handler: () => {
              this.navCtrl.navigateForward('subscription');
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.navCtrl.navigateForward('live-streaming');
    }
  }

  private async setupAccountReminders() {
    try {
      const settings = <AccountSetting>await this.accountService.getAccountSetting();
      const time = settings.what_time.split(':');
      await this.accountService.setWorkoutReminder(
        settings.workout_reminder,
        time.length > 1 ? parseFloat(time[0]) : 0,
        time.length > 1 ? parseFloat(time[1]) : 0
      );
      await this.accountService.setPhotoReminder(true, settings.photo_reminder);
      await this.accountService.setWeighInReminder(true, settings.weigh_reminder);
      await this.accountService.subscribeToLiveStream(settings.receive_livestream_notification);
    } catch (e) {
      // console.log('error', e);
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }

  public sideMenuNavigation() {
    SideMenuHandlerEmitter.getEmitter().subscribe(event =>
      this.canLeaveAndroidBack = event === 'navigating' ? true : this.canLeaveAndroidBack
    );
  }
}
