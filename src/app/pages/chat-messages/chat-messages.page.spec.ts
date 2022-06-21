import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessagesPage } from './chat-messages.page';

describe('ChatMessagesPage', () => {
  let component: ChatMessagesPage;
  let fixture: ComponentFixture<ChatMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessagesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
