import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-marketing-questions',
  templateUrl: './marketing-questions.component.html',
  styleUrls: ['./marketing-questions.component.scss']
})
export class MarketingQuestionsComponent implements OnInit {

  @Output()
  public previous: EventEmitter<undefined> = new EventEmitter();

  @Output()
  public complete: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      understand_nutrition: new FormControl('', [Validators.required]),
      committed_to_exercise: new FormControl('', [Validators.required]),
      understand_supplements: new FormControl('', [Validators.required])
    });
  }


  public async movePrevious() {
    this.previous.emit();
  }

  public submitForm() {
    this.complete.emit(this.form.getRawValue());
  }
}
