import { Component, Input, OnInit } from '@angular/core';
import { Transphormer } from '../../services/authentication/authentication.service';
import { TrainerTransphormerService } from '../../services/trainer-transphormer/trainer-transphormer.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MacroCountingInfo } from '../../services/nutrition/nutrition.service';
import { TrackedFood } from '../../services/food-items/food-items.service';
import { MacroInfo } from '../../pages/nutrition/nutrition-calculator';

interface MealInfo extends MacroInfo {
  meal: string;
}

@Component({
  selector: 'app-nutrition-detail',
  templateUrl: './nutrition-detail.component.html',
  styleUrls: ['./nutrition-detail.component.scss'],
})
export class NutritionDetailComponent implements OnInit {

  public transphormer: Transphormer;
  public dayData: [{
    track_date: string | Date | Moment,
    short_date: string,
    carbs: number,
    fats: number,
    calories: number,
    protein: number,
    meals: MealInfo[]
  }?] = [];
  public expansions = [];

  @Input()
  public nutritionInfo: MacroCountingInfo[];

  @Input()
  public transphormerId: any;

  constructor(
    private transphormerService: TrainerTransphormerService,
  ) {
  }

  ngOnInit() {
    if (!this.nutritionInfo) {
      this.loadTransphormer(this.transphormerId);
    }
  }

  public async loadTransphormer(id: string) {
    this.transphormer = <Transphormer>await this.transphormerService.transphormer(+id);
    this.loadDefaultNutritionData();
  }

  public async loadDefaultNutritionData() {

    this.nutritionInfo.forEach((day) => {
      const dayInfo = this.processDay(day);
      this.dayData.push(dayInfo);
    });

  }

  public expandDate(macro) {
    if (macro.calories === 0) {
      return;
    }
    const date = macro.track_date;
    this.expansions[date] = (this.expansions[date] ? !this.expansions[date] : true);
  }

  public processDay(day: MacroCountingInfo) {
    const mealNumbers = [];
    const meals: MealInfo[] = [];

    day.tracked_items.forEach((item) => {
      if (mealNumbers.indexOf(item.meal) === -1) {
        mealNumbers.push(item.meal);
      }
    });

    mealNumbers.forEach((number) => {
      meals.push({
        meal: number,
        ...this.sumAll(day, number)
      });
    });

    return {
      track_date: day.track_date,
      short_date: moment(day.track_date).format('M/D'),
      ...this.sumAll(day),
      meals
    };
  }

  public sumAll(day, meal?): MacroInfo {
    const val: MacroInfo = <any>{};
    const items = ['calories', 'fats', 'protein', 'carbs'];
    items.forEach((i) => {
      val[i] = this.sumMacro(i, day, meal);
    });
    return val;
  }

  sumMacro(macro: string, day: MacroCountingInfo, meal?: number) {
    return Math.round(day.tracked_items.reduce((a, v: TrackedFood) => !meal ? a + v[macro] : (v.meal !== meal ? a : (a + v[macro])), 0));
  }

  get sortedFood() {
    return this.dayData.sort((a, b) => a.track_date < b.track_date ? 1 : -1);
  }


}
