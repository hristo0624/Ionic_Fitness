import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveStreamingPage } from './live-streaming.page';

describe('LiveStreamingPage', () => {
  let component: LiveStreamingPage;
  let fixture: ComponentFixture<LiveStreamingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LiveStreamingPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStreamingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
