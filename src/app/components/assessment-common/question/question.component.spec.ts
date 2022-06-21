import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import { AssessmentQuestion } from '../../../services/assessments/assessments';

const DefaultQuestion = <AssessmentQuestion>{
  id: 'question-0',
  title: 'Question Title',
  description: 'Question Description',
  order: 0,
  options: [{
    value: 1,
    order: 0,
    title: 'Option 1',
    icon: 'happy'
  }, {
    value: 2,
    order: 1,
    title: 'Option 2',
    icon: 'handy'
  }]
};

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.question = DefaultQuestion;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show title and render options', () => {
    component.question = DefaultQuestion;
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('.title').innerHTML).toEqual(DefaultQuestion.title);
    expect(fixture.elementRef.nativeElement.querySelectorAll('.option').length).toEqual(DefaultQuestion.options.length);
  });

  it('should emit out the correct option selected when clicked', fakeAsync(() => {
    component.question = DefaultQuestion;
    fixture.detectChanges();
    component.optionSelected.subscribe(option => {
      expect(option).toEqual(DefaultQuestion.options[0]);
    });
    fixture.elementRef.nativeElement.querySelector('.option').click();
  }));

  it('should have the option highlighted if option is selected', () => {
    component.question = DefaultQuestion;
    component.question.options[0].is_selected = true;
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelectorAll('.option.selected').length).toEqual(1);
  });

});
