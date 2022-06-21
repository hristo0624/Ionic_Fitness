import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutritionDetailPage } from './nutrition-detail.page';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { Transphormer } from '../../../services/authentication/authentication.service';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { IonicModule } from '@ionic/angular';
import { MacroCountingInfo, NutritionService } from '../../../services/nutrition/nutrition.service';
import * as moment from 'moment';

class TransphormerDetailSpy {
  private _transphormer: Transphormer = <Transphormer>{id: 33, display_name: 'Jane Transphormer'};

  transphormer = jasmine.createSpy('transphormer').and.returnValue(
    Promise.resolve(Object.assign({}, this._transphormer))
  );
}

class NutritionServiceSpy {
  private nutritionData: MacroCountingInfo[];

  transphormer = jasmine.createSpy('transphormer').and.callFake(
    () => {
      Promise.resolve(Object.assign({}, this.nutritionData));
    });

  private dateData: [{
      date: string,
      data: MacroCountingInfo[];
    }];

  public createFoodItem() {
    const meh = {
      fats: 5,
      carbs: 6,
      protein: 7,
      calories: 97,
    };
    return {
      id: 5,
      meal: null,
      name: 'Test Item',
      ...meh,
      consumed_amount: 1,
      consumed_unit: 'ounce',
      is_custom: true,
      is_custom_food_template: true,
      serving_information: {
        ...meh,
        serving_amount: 1,
        consumed_unit: 'ounce',
        alt_servings: []
      }
    };
  }

  public setDates(days: number) {
    const d = moment();
    for (let i = 0; i < days; i++) {
      d.subtract(i, 'day');
        this.dateData.push(<any>{
          // track_date: d.format('YYYY-mm-dd'),
        });
    }

  }
}

describe('NutritionDetailPage', () => {

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionDetailPage],
      imports: [
        IonicModule,
      ],
      providers: [{provide: ActivatedRoute, useValue: activatedRoute},
        {provide: TrainerTransphormerService, useClass: TransphormerDetailSpy},
        {provide: NutritionService, useClass: NutritionServiceSpy}
      ]
    });
  });

  let fixture: ComponentFixture<NutritionDetailPage>;
  let component: NutritionDetailPage;
  let tSpy: TransphormerDetailSpy;
  let nSpy: NutritionServiceSpy;

  function createComponent() {
    fixture = TestBed.createComponent(NutritionDetailPage);
    component = fixture.componentInstance;
    // page = new Page(fixture);

    tSpy = <any>fixture.debugElement.injector.get(TrainerTransphormerService);
    nSpy = <any>fixture.debugElement.injector.get(NutritionService);
    fixture.detectChanges(); // Set up subscribe.
    return fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
      });
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load the transphormer ID passed in', async () => {
    activatedRoute.setParamMap({id: 33});
    createComponent();
    expect(component).toBeTruthy();
    await fixture.whenStable();
    expect(tSpy.transphormer).toHaveBeenCalledWith(33);
    expect(component.transphormer).toBeDefined();
  });

  it('should load the last 2 weeks of data', async () => {
    activatedRoute.setParamMap({id: 33});
    createComponent();
    await fixture.whenStable();
    expect(tSpy.transphormer).toHaveBeenCalledWith(33);
    expect(component.transphormer).toBeDefined();
  });
});
