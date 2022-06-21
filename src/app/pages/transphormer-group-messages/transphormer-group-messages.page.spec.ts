import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransphormerGroupMessagesPage } from './transphormer-group-messages.page';

describe('TransphormerGroupMessagesPage', () => {
  let component: TransphormerGroupMessagesPage;
  let fixture: ComponentFixture<TransphormerGroupMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransphormerGroupMessagesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransphormerGroupMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
