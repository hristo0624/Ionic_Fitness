import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMealComponent } from './edit-meal.component';

describe('EditMealComponent', () => {
  let component: EditMealComponent;
  let fixture: ComponentFixture<EditMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMealComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
