import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingQuestionsComponent } from './marketing-questions.component';

describe('MarketingQuestionsComponent', () => {
  let component: MarketingQuestionsComponent;
  let fixture: ComponentFixture<MarketingQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingQuestionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
