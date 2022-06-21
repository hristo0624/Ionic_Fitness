import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDetailPage } from './trainer-detail.page';

describe('TrainerDetailPage', () => {
  let component: TrainerDetailPage;
  let fixture: ComponentFixture<TrainerDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerDetailPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
