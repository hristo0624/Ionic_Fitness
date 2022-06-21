import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Trainer, TrainerService } from '../../services/trainer/trainer.service';
import {
  LoadingController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import { Transphormer } from '../../services/authentication/authentication.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { pick } from 'lodash';

@Component({
  selector: 'app-trainer-registration',
  templateUrl: './trainer-registration.page.html',
  styleUrls: ['./trainer-registration.page.scss'],
})
export class TrainerRegistrationPage implements OnInit {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private trainerService: TrainerService,
    private loadingCtrl: LoadingController,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
  ) {
  }

  public get transphormer(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  ngOnInit() {
    const coachNameRequiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
      const has_legionnaire_coach = control.get('has_legionnaire_coach');
      const legionnaire_coach = control.get('legionnaire_coach');

      return has_legionnaire_coach.value === '1' &&
        legionnaire_coach.value === '' ? { 'coachRequired': true } : null;
    };

    this.form = this.formBuilder.group({
      address: this.formBuilder.control(''),
      address2: this.formBuilder.control(''),
      city: this.formBuilder.control(''),
      state: this.formBuilder.control(''),
      postal_code: this.formBuilder.control(''),
      phone: this.formBuilder.control(''),
      country: this.formBuilder.control(''),
      facebook: this.formBuilder.control(''),
      instagram: this.formBuilder.control(''),
      linkedin: this.formBuilder.control(''),
      pintrest: this.formBuilder.control(''),
      twitter: this.formBuilder.control(''),
      youtube: this.formBuilder.control(''),
      certifications: this.formBuilder.control('', [Validators.required]),
      facebook_group: this.formBuilder.control(''),
      current_training_clients: this.formBuilder.control('', [Validators.required]),
      years_training: this.formBuilder.control('', [Validators.required]),
      creates_nutrition_plans: this.formBuilder.control('', [
        Validators.required,
      ]),
      passed_basic_training: this.formBuilder.control('', [
        Validators.required,
      ]),
      recommends_supplements: this.formBuilder.control('', [
        Validators.required,
      ]),
      has_legionnaire_coach: this.formBuilder.control('', [
        Validators.required,
      ]),
      creates_workout_plans: this.formBuilder.control('', [
        Validators.required,
      ]),
      legionnaire_coach: this.formBuilder.control(''),
      how_train_clients: this.formBuilder.control('', [Validators.required]),
    }, { validators: coachNameRequiredValidator });
    this.populateForm();
  }

  public async populateForm() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading profile...',
    });
    await loader.present();

    try {
      const trainer: Trainer = <Trainer>(
        await this.trainerService.getTrainerByTransphormerId(this.transphormer.id)
      );

      for (const attribute in pick(trainer, Object.keys(this.form.getRawValue()))) {
        if (trainer.hasOwnProperty(attribute)) {
          this.form.get(attribute).setValue(trainer[attribute]);
        }
      }
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public async submit() {
    try {
      await this.trainerService.updateTrainer(
        this.trainer().trainer.id,
        this.form.getRawValue()
      );
      this.toastSvc.flash('Profile saved.');
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public trainer(): Transphormer {
    return <Transphormer>(
      JSON.parse(window.localStorage.getItem('transphormer'))
    );
  }
}
