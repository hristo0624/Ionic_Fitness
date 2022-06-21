import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyTasksPage } from './daily-tasks.page';

describe('DailyTasksPage', () => {
  let component: DailyTasksPage;
  let fixture: ComponentFixture<DailyTasksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyTasksPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
