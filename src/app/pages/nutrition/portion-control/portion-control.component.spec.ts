import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PortionControlComponent } from './portion-control.component';

describe('PortionControlComponent', () => {
  let component: PortionControlComponent;
  let fixture: ComponentFixture<PortionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PortionControlComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
