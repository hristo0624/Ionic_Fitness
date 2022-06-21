import { Component, OnInit } from '@angular/core';
import { MacroCountingInfo } from '../../../services/nutrition/nutrition.service';
import { ActivatedRoute } from '@angular/router';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { Transphormer } from '../../../services/authentication/authentication.service';
import * as moment from 'moment';
import { TrackedFood } from '../../../services/food-items/food-items.service';
import { Moment } from 'moment';
import { MacroInfo } from '../../nutrition/nutrition-calculator';

interface MealInfo extends MacroInfo {
  meal: string;
}

@Component({
  selector: 'app-nutrition-detail',
  templateUrl: './nutrition-detail.page.html',
  styleUrls: ['./nutrition-detail.page.scss'],
})
export class NutritionDetailPage implements OnInit {
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
  private expansions = [];

  constructor(
    private trainerTransphormerService: TrainerTransphormerService,
    private transphormerService: TrainerTransphormerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(pmap => this.loadTransphormer(pmap.get('id')));
  }

  public async loadTransphormer(id: string) {
    this.transphormer = <Transphormer>await this.transphormerService.transphormer(+id);
    this.loadDefaultNutritionData();
  }

  public get backHref() {
    return this.transphormer ? `/details/${this.transphormer.id}` : '/my-transphormers';
  }

  public async loadDefaultNutritionData() {
    const end = moment();
    const start = moment().subtract(14, 'day');
    return this.trainerTransphormerService.trackedItems(
      this.transphormer.id,
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD'),
    )
      .then((result: MacroCountingInfo[]) => {
        result.forEach((day) => {
          const dayInfo = this.processDay(day);
          this.dayData.push(dayInfo);
        });
      });
  }

  public expandDate(macro) {
    if (macro.calories === 0) {
      return;
    }
    const date = macro.track_date;
    this.expansions[date] = (this.expansions[date] ? !this.expansions[date] : true);
  }

  sumMacro(macro: string, day: MacroCountingInfo, meal?: number) {
    return Math.round(day.tracked_items.reduce((a, v: TrackedFood) => !meal ? a + v[macro] : (v.meal !== meal ? a : (a + v[macro])), 0));
  }

  public sumAll(day, meal?): MacroInfo {
    const val: MacroInfo = <any>{};
    const items = ['calories', 'fats', 'protein', 'carbs'];
    items.forEach((i) => {
      val[i] = this.sumMacro(i, day, meal);
    });
    return val;
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

  get sortedFood() {
    return this.dayData.sort((a, b) => a.track_date < b.track_date ? 1 : -1);
  }

}
