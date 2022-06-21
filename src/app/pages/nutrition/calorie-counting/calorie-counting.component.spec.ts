import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalorieCountingComponent } from './calorie-counting.component';

describe('CalorieCountingComponent', () => {
  let component: CalorieCountingComponent;
  let fixture: ComponentFixture<CalorieCountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalorieCountingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalorieCountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
