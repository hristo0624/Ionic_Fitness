import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutsInfoComponent } from './workouts-info.component';

describe('WorkoutsInfoComponent', () => {
  let component: WorkoutsInfoComponent;
  let fixture: ComponentFixture<WorkoutsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutsInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
