import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerMessagesPage } from './trainer-messages.page';

describe('TrainerMessagesPage', () => {
  let component: TrainerMessagesPage;
  let fixture: ComponentFixture<TrainerMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerMessagesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
