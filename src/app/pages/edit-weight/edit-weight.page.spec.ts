import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWeightPage } from './edit-weight.page';

describe('EditWeightPage', () => {
  let component: EditWeightPage;
  let fixture: ComponentFixture<EditWeightPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWeightPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
