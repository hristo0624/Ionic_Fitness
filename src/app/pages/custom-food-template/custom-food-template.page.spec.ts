import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomFoodTemplatePage } from './custom-food-template.page';

describe('CustomFoodTemplatePage', () => {
  let component: CustomFoodTemplatePage;
  let fixture: ComponentFixture<CustomFoodTemplatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFoodTemplatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFoodTemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
