import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PersonalInfo } from '../../../../services/onboarding/onboarding.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  @Output()
  public complete: EventEmitter<PersonalInfo> = new EventEmitter();

  public form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      date_of_birth: new FormControl('1988-01-01', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      goal_weight: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
    });
  }

  public submitForm() {
    const info = <PersonalInfo>this.form.getRawValue();
    this.complete.emit(<PersonalInfo>info);
  }

}
