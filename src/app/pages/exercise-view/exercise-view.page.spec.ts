import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseViewPage } from './exercise-view.page';

describe('VideoPage', () => {
  let component: ExerciseViewPage;
  let fixture: ComponentFixture<ExerciseViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseViewPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
