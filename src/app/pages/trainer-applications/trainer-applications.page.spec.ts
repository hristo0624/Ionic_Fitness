import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerApplicationsPage } from './trainer-applications.page';

describe('TrainerApplicationsPage', () => {
  let component: TrainerApplicationsPage;
  let fixture: ComponentFixture<TrainerApplicationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerApplicationsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
