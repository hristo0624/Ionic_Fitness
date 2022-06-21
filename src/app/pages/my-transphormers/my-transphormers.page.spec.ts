import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTransphormersPage } from './my-transphormers.page';

describe('MyTransphormersPage', () => {
  let component: MyTransphormersPage;
  let fixture: ComponentFixture<MyTransphormersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTransphormersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTransphormersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
