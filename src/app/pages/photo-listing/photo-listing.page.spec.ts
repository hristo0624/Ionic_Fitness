import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoListingPage } from './photo-listing.page';

describe('PhotoListingPage', () => {
  let component: PhotoListingPage;
  let fixture: ComponentFixture<PhotoListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoListingPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
