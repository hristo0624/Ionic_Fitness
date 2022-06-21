import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  TrainingLevels,
  TransphormationGoal,
  ActiveLevels,
  OnboardingService,
  TrainingProgramTypes, TrainingHomeWorkouts, Sex,
} from '../../services/onboarding/onboarding.service';
import {
  LoadingController, ModalController,
  NavController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import { pick } from 'lodash';
import { Transphormer } from '../../services/authentication/authentication.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { CustomMacrosComponent } from '../../components/nutrition/custom-macros/custom-macros.component';
import { NutritionCalculatorService } from '../../services/nutrition-calculator/nutrition-calculator.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  @Output()
  public complete: EventEmitter<undefined> = new EventEmitter();

  public transphormer: Transphormer;
  public form: FormGroup;
  public trainingLevels = TrainingLevels;
  public transphormationGoals = TransphormationGoal;
  public activeLevels = ActiveLevels;
  public programTypes = TrainingProgramTypes;
  public is_free_user = false;
  public homeWorkouts = TrainingHomeWorkouts;
  public email = '';
  public SexValues = Sex;

  constructor(
    private modal: ModalController,
    private nutritionCalculatorService: NutritionCalculatorService,
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private loadingCtrl: LoadingController,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private navCtrl: NavController,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      first_name: this.formBuilder.control('', [Validators.required]),
      last_name: this.formBuilder.control('', [Validators.required]),
      height: this.formBuilder.control('', [Validators.required]),
      weight: this.formBuilder.control('', [Validators.required]),
      goal_weight: this.formBuilder.control('', [Validators.required]),
      date_of_birth: this.formBuilder.control('', [Validators.required]),
      sex: this.formBuilder.control('', [Validators.required]),
      activity_level: this.formBuilder.control('', [Validators.required]),
      training_level: this.formBuilder.control('', [Validators.required]),
      transphormation_goal: this.formBuilder.control('', [Validators.required]),
      access_to_gym: this.formBuilder.control('', [Validators.required]),
      likely_to_do: this.formBuilder.control('', [Validators.required]),
      home_workout_selection: this.formBuilder.control(''),
      gym_workout_selection: this.formBuilder.control(''),
      meals_per_day: this.formBuilder.control(''),
      preference_macro_counting: this.formBuilder.control(''),
    });
    this.fetchProfile();
  }

  protected goPremium() {
    this.navCtrl.navigateRoot('subscription');
  }

  protected async fetchProfile() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const transphormer = this.transphormer = <Transphormer>(
        await this.onboardingService.fetchOnBoard()
      );

      for (const attribute in pick(
        transphormer,
        Object.keys(this.form.getRawValue())
      )) {
        if (transphormer.hasOwnProperty(attribute)) {
          this.form.get(attribute).setValue(transphormer[attribute]);
        }
      }

      this.form.get('date_of_birth').setValue(transphormer.dob);
      this.is_free_user = !transphormer.is_paid_user;
      this.email = transphormer.email;
      this.form.valueChanges.subscribe(() => {
        const values = this.form.getRawValue();
        if (values.likely_to_do === 'Calorie / Macro counting' && this.is_free_user) {
          values.likely_to_do = 'Portion control';
        }
        this.transphormer = Object.assign({}, this.transphormer, values);
      });
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public get isMacroCalorieCounting() {
    if (!this.transphormer) {
      return false;
    }
    return this.transphormer.is_paid_user && (this.form.get('likely_to_do').value === 'Calorie / Macro counting');
  }

  public async updateProfile() {
    try {
      const data = <Transphormer>this.form.getRawValue();
      if (data.likely_to_do !== 'Macro meal plan') {
        data.meals_per_day = 0;
      }
      await this.onboardingService.updateOnBoardInformation(data);
      this.toastSvc.flash('Profile saved.');
      this.analyticService.logEvent(AnalyticEvents.UpdatingProfile, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public goToWeighIn() {
    this.navCtrl.navigateRoot('weight', {
      animationDirection: 'forward',
      animated: true
    });
  }

  public getProgramType(value) {
    return this.programTypes.find(programType => programType.value === value);
  }

  public get hasCustomMacros() {
    if (!this.transphormer) {
      return false;
    }

    return this.transphormer.custom_macros && !this.transphormer.custom_macros.reset_to_original;
  }

  /**
   * Open modal for editing/creating custom macro
   */
  public async openCustomMacro() {
    const bmrValues = this.nutritionCalculatorService.calculateAdvancedMacros(
      +this.transphormer.latest_weight_value, +this.transphormer.goal_weight, this.transphormer.activity_level,
      this.transphormer.transphormation_goal, this.transphormer.sex, this.transphormer.preference_macro_counting
    );

    const macroModal = await this.modal.create({
      component: CustomMacrosComponent,
      componentProps: {
        originalMacro: bmrValues,
      }
    });

    await macroModal.present();

    const result = await macroModal.onDidDismiss();

    if (result.data) {
      const custom_macros = result.data;
      this.transphormer = Object.assign({}, this.transphormer, { custom_macros });
    }
  }
}
