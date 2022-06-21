import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoGatheringPage } from './info-gathering.page';

describe('InfoGatheringPage', () => {
  let component: InfoGatheringPage;
  let fixture: ComponentFixture<InfoGatheringPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoGatheringPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGatheringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
