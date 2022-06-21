import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  TrainingLevels,
  TransphormationGoal,
  ActiveLevels,
  TrainingProgramTypes,
  TrainingHomeWorkouts
} from '../../../../services/onboarding/onboarding.service';


@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @Output()
  public previous: EventEmitter<undefined> = new EventEmitter();

  @Output()
  public complete: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  public trainingLevels = TrainingLevels;
  public transphormationGoal = TransphormationGoal;
  public activeLevel = ActiveLevels;
  public programTypes = TrainingProgramTypes;
  public homeWorkouts = TrainingHomeWorkouts;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      activity_level: this.formBuilder.control('', [Validators.required]),
      training_level: this.formBuilder.control('', [Validators.required]),
      transphormation_goal: this.formBuilder.control('', [Validators.required]),
      access_to_gym: this.formBuilder.control('', [Validators.required]),
      gym_workout_selection: this.formBuilder.control({value: null, disabled: true}, [Validators.required]),
      home_workout_selection: this.formBuilder.control({value: null, disabled: true}, [Validators.required]),
      likely_to_do: this.formBuilder.control('', [Validators.required]),
      meals_per_day: this.formBuilder.control({value: null, disabled: true}, [Validators.required]),
      preference_macro_counting: this.formBuilder.control({value: null, disabled: true}, [Validators.required]),
    });

    this.form.get('likely_to_do').valueChanges.subscribe((value) => {
      this.form.get('meals_per_day').disable();
      this.form.get('preference_macro_counting').disable();

      if (value === 'Macro meal plan') {
        this.form.get('meals_per_day').enable();
      } else if (value === 'Calorie / Macro counting') {
        this.form.get('preference_macro_counting').enable();
      }
    });

    this.form.get('access_to_gym').valueChanges.subscribe((value) => {
      this.form.get('gym_workout_selection').disable();
      this.form.get('home_workout_selection').disable();

      if (value === 1) {
        this.form.get('gym_workout_selection').enable();
      } else {
        this.form.get('home_workout_selection').enable();
      }
    });
  }

  public getPt(value) {
    return this.programTypes.find(programType => programType.value === value);
  }

  public movePrevious() {
    this.previous.emit();
  }

  public submitForm() {
    this.complete.emit(this.form.getRawValue());
  }
}
