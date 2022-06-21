import { Weight, WeightsService } from '../../services/weights/weights.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Moment } from 'moment';
import { PickItemComponent } from './pick-item/pick-item.component';
import { MealInfoComponent } from './meal-info/meal-info.component';
import { NutritionItem, NutritionService } from '../../services/nutrition/nutrition.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { MacroInfo, NutritionCalculator } from './nutrition-calculator';
import { Transphormer } from '../../services/authentication/authentication.service';
import { NutritionValues } from '../../services/onboarding/onboarding.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';

type ParentTypes = 'breakfast' | 'lunch' | 'dinner' | 'supplements' | 'snack';
export type CategoryTypes =
  | 'protein'
  | 'fat'
  | 'carb'
  | 'ignition'
  | 'supplement'
  | 'veggie';

export interface Parent {
  name: string;
  type: ParentTypes;
  categories: Category[];
  food?: FoodItem[];
}

export interface Category {
  name: string;
  type: CategoryTypes;
  selectedNutrition?: NutritionItem;
}

interface CustomizableNutrition {
  [key: string]: Parent[];
}

export interface FoodItem {
  name: string;
  categories: Category[];
}

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit, CanLeaveRoute {
  public canLeaveAndroidBack = true;

  protected nutritionItems: NutritionItem[];

  public activeParents: Parent[] = [];

  public latestWeight: Weight;
  public today: Moment = moment();

  public nutritionDays: CustomizableNutrition = {};
  public activeDate: string;
  public bmr: MacroInfo;
  public minDate: Moment;

  public fullHeight = true;

  private calculator: NutritionCalculator;

  constructor(
    private modal: ModalController,
    private loadingCtrl: LoadingController,
    private nutritionService: NutritionService,
    private toastCtrl: ToastController,
    public errorService: ErrorsService,
    public weightService: WeightsService,
    public analyticService: AnalyticsService
  ) {
    this.minDate = moment(JSON.parse(window.localStorage.getItem('transphormer')).created_at);
  }

  ngOnInit() {
    this.setupNutritionItems();
    this.setupNutritionDays();
    this.setupActiveDate();
  }

  public get shouldShowAmounts() {
    return this.getNutritionType() === 'Macro meal plan';
  }

  public async pickItem(category: Category) {
    this.canLeaveAndroidBack = false;
    const myModal = await this.modal.create({
      component: PickItemComponent,
      backdropDismiss: false,
      componentProps: {
        showAmounts: this.shouldShowAmounts,
        calculator: this.calculator,
        nutritionItems: this.nutritionItems.filter(
          item => item.type === category.type
        ),
        headerTitle: category.name,
        checkedNutritionId: category.selectedNutrition
          ? (<NutritionItem>category.selectedNutrition).name
          : null,
        weight: this.latestWeight.weight,
        category: category,
      },
    });
    await myModal.present();

    const data = <NutritionItem | null>(await myModal.onDidDismiss()).data;
    this.canLeaveAndroidBack = true;

    if (data) {
      category.selectedNutrition = data;
      if (this.shouldShowAmounts) {
        category.selectedNutrition.calculatedQuantity = this.calculator.nutritionValue(category.type, category.selectedNutrition.name);
      }
    } else if (data === null) {
      category.selectedNutrition = null;
    }

    this.updateNutritionValue();
  }

  public updateNutritionValue() {
    const data = {
        type: this.getNutritionType(),
        value: this.nutritionDays
      }
    ;
    window.localStorage.setItem('completeNutrition', JSON.stringify(data));
    this.analyticService.logEvent(AnalyticEvents.LoggingNutrition);
  }

  public async mealInfo() {
    this.canLeaveAndroidBack = false;
    const mealInfoModal = await this.modal.create({
      component: MealInfoComponent,
      backdropDismiss: false,
    });
    await mealInfoModal.present();

    await mealInfoModal.onDidDismiss();
    this.canLeaveAndroidBack = true;
  }

  private async setupNutritionItems() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loader.present();
    try {
      const latestWeight = this.weightService.latestWeight();
      this.nutritionItems = <NutritionItem[]>(
        await this.nutritionService.getNutritionItems()
      );
      this.latestWeight = <Weight>await latestWeight;
      this.setupCalculator();
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(e),
        duration: 3000,
      });
      await toast.present();
    } finally {
      loader.dismiss();
    }
  }

  private setupCalculator() {
    this.calculator = new NutritionCalculator(this.transphormer,
      this.latestWeight.weight, this.transphormer.meals_per_day);
    this.calculateBmr();
  }

  private getParents(): Parent[] {

    if (this.getNutritionType() === 'Portion control') {
      return [
        {
          name: 'Breakfast',
          type: 'breakfast',
          categories: [
            {
              name: 'Protein',
              type: 'protein',
              selectedNutrition: null,
            },
            {
              name: 'Carb',
              type: 'carb',
              selectedNutrition: null,
            },
            {
              name: 'Veggie',
              type: 'veggie',
              selectedNutrition: null,
            },
          ],
        },
        {
          name: 'Lunch',
          type: 'lunch',
          categories: [
            {
              name: 'Protein',
              type: 'protein',
              selectedNutrition: null,
            },
            {
              name: 'Carb',
              type: 'carb',
              selectedNutrition: null,
            },
            {
              name: 'Veggie',
              type: 'veggie',
              selectedNutrition: null,
            },
          ],
        },
        {
          name: 'Dinner',
          type: 'dinner',
          categories: [
            {
              name: 'Protein',
              type: 'protein',
              selectedNutrition: null,
            },
            {
              name: 'Carb',
              type: 'carb',
              selectedNutrition: null,
            },
            {
              name: 'Veggie',
              type: 'veggie',
              selectedNutrition: null,
            },
          ],
        },
        {
          name: 'Supplements',
          type: 'supplements',
          categories: [
            {
              name: 'Ignition',
              type: 'ignition',
              selectedNutrition: null,
            },
            {
              name: 'Phormula-1',
              type: 'supplement',
              selectedNutrition: null,
            },
          ],
        },
      ];

    } else if (this.getNutritionType() === 'Macro meal plan') {
      const plan = [];
      let mealCounter = 1;

      plan.push({
        name: `Meal ${mealCounter}`,
        type: 'breakfast',
        categories: [
          {
            name: 'Protein',
            type: 'protein',
            selectedNutrition: null,
          },
          {
            name: 'Carb',
            type: 'carb',
            selectedNutrition: null,
          },
          {
            name: 'Veggie',
            type: 'veggie',
            selectedNutrition: null,
          },
        ],
      });
      mealCounter++;

      if (this.transphormer.meals_per_day >= 4) {
        plan.push({
          name: `Meal ${mealCounter}`,
          type: 'snack',
          categories: [
            {
              name: 'Protein',
              type: 'protein',
              selectedNutrition: null,
            },
            {
              name: 'Carb',
              type: 'carb',
              selectedNutrition: null,
            },
            {
              name: 'Veggie',
              type: 'veggie',
              selectedNutrition: null,
            },
          ],
        });
        mealCounter++;
      }

      plan.push({
        name: `Meal ${mealCounter}`,
        type: 'lunch',
        categories: [
          {
            name: 'Protein',
            type: 'protein',
            selectedNutrition: null,
          },
          {
            name: 'Carb',
            type: 'carb',
            selectedNutrition: null,
          },
          {
            name: 'Veggie',
            type: 'veggie',
            selectedNutrition: null,
          },
        ],
      });
      mealCounter++;

      if (this.transphormer.meals_per_day === 5) {
        plan.push({
          name: `Meal ${mealCounter}`,
          type: 'snack',
          categories: [
            {
              name: 'Protein',
              type: 'protein',
              selectedNutrition: null,
            },
            {
              name: 'Carb',
              type: 'carb',
              selectedNutrition: null,
            },
            {
              name: 'Veggie',
              type: 'veggie',
              selectedNutrition: null,
            },
          ],
        });
        mealCounter++;
      }

      plan.push({
        name: `Meal ${mealCounter}`,
        type: 'dinner',
        categories: [
          {
            name: 'Protein',
            type: 'protein',
            selectedNutrition: null,
          },
          {
            name: 'Carb',
            type: 'carb',
            selectedNutrition: null,
          },
          {
            name: 'Veggie',
            type: 'veggie',
            selectedNutrition: null,
          },
        ],
      });
      mealCounter++;
      plan.push({
        name: `Meal ${mealCounter}`,
        type: 'supplements',
        categories: [
          {
            name: 'Ignition',
            type: 'ignition',
            selectedNutrition: null,
          },
          {
            name: 'Phormula-1',
            type: 'supplement',
            selectedNutrition: null,
          },
        ],
      });

      return plan;
    } else {
      return [
        {
          name: 'Meal 1',
          type: 'breakfast',
          categories: [],
          food: [{
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }]
        },
        {
          name: 'Meal 2',
          type: 'snack',
          categories: [],
          food: [{
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }]
        },
        {
          name: 'Meal 3',
          type: 'lunch',
          categories: [],
          food: [{
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }]
        },
        {
          name: 'Meal 4',
          type: 'snack',
          categories: [],
          food: [{
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }]
        },
        {
          name: 'Meal 5',
          type: 'dinner',
          categories: [],
          food: [{
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }, {
            name: '',
            categories: [
              {
                name: 'Protein',
                type: 'protein',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'protein',
                  quantity: null,
                },
              },
              {
                name: 'Carb',
                type: 'carb',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'carb',
                  quantity: null,
                },
              },
              {
                name: 'Veggie',
                type: 'veggie',
                selectedNutrition: <NutritionItem>{
                  name: 'Value',
                  type: 'veggie',
                  quantity: null,
                },
              }
            ]
          }]
        },
      ];
    }


  }

  public get transphormer(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  private setupNutritionDays() {
    const nutrition: {
      value: CustomizableNutrition;
      type: NutritionValues
    } | null | undefined = JSON.parse(window.localStorage.getItem('completeNutrition'));

    if (nutrition) {
      if (nutrition.type === this.getNutritionType()) {
        this.nutritionDays = nutrition.value;
      } else {
        const today = this.today.format('YYYY-MM-DD');
        this.nutritionDays[today] = this.getParents();
      }
    } else {
      const today = this.today.format('YYYY-MM-DD');
      this.nutritionDays[today] = this.getParents();
    }

  }

  private setupActiveDate() {
    this.activeDate = this.today.format('YYYY-MM-DD');

    if (!this.nutritionDays.hasOwnProperty(this.activeDate)) {
      this.nutritionDays[this.activeDate] = this.getParents();
    }

    this.activeParents = this.nutritionDays[this.activeDate];

  }

  /**
   * Handler to check date change events from week tab
   *
   * @param newDate
   */
  public onDateChange(newDate: Date) {
    const date = moment(newDate);

    this.activeDate = date.format('YYYY-MM-DD');
    if (!this.nutritionDays.hasOwnProperty(this.activeDate)) {
      this.nutritionDays[this.activeDate] = this.getParents();
    }

    this.activeParents = this.nutritionDays[this.activeDate];
  }

  public calculateBmr() {
    this.bmr = this.calculator.getMacros();
  }

  public updateMacroCounting(value: Parent[]) {
    this.activeParents = value;
    this.nutritionDays[this.activeDate] = this.activeParents;
    this.updateNutritionValue();
  }

  public getNutritionType(): NutritionValues {
    if (this.transphormer.is_paid_user) {
      return this.transphormer.likely_to_do;
    }
    if (this.transphormer.likely_to_do === 'Calorie / Macro counting') {
      return 'Portion control';
    }
    return this.transphormer.likely_to_do;
  }
}
