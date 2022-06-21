import { Transphormer } from '../../services/authentication/authentication.service';
import { CategoryTypes } from './nutrition.page';
import { choices, macros, values } from './nutrition-values';
import { Sex, TransphormationGoalTypes } from '../../services/onboarding/onboarding.service';

export interface MacroInfo {
  calories: number;
  percentProtein?: number;
  percentCarbs?: number;
  percentFats?: number;
  protein: number;
  carbs: number;
  fats: number;
}

export class NutritionCalculator {
  static MAX_MALE_PROFILE = 6;
  static MAX_FEMALE_PROFILE = 7;

  public sex: string;
  public index: any[] = [];
  public userProfile: number;

  public constructor(protected transphormer: Transphormer,
                     protected weight: number,
                     protected numberOfMeals: number | null = null) {
    this.sex = this.transphormer.sex === Sex.Male ? 'male' : 'female';

    const baseProfile = this.getBaseProfile(this.sex, this.weight);
    this.userProfile = this.getModifiedProfile(baseProfile, this.transphormer.transphormation_goal, this.sex);

    for (const type in choices) {
      if (choices[type] instanceof Array) {
        this.index[type] = choices[type].map((i) => {
          return i.name;
        });
      }
    }
  }

  public getModifiedProfile(base: number, goal: TransphormationGoalTypes, sex: string) {
    if (goal === 'Primarily lose bodyfat') {
      return Math.max(0, base - 1);
    } else if (goal === 'Gain lean muscle') {
      const maxColumn = (sex === 'male' ? NutritionCalculator.MAX_MALE_PROFILE : NutritionCalculator.MAX_FEMALE_PROFILE);
      return Math.min(maxColumn, base + 1);
    }
    return base;
  }

  public getBaseProfile(sex: string, weight: number): number {
    if (sex === 'male') {
      if (weight >= 260) {
        return 6;
      } else if (weight >= 220) {
        return 5;
      } else if (weight >= 200) {
        return 4;
      } else if (weight >= 185) {
        return 3;
      } else if (weight >= 160) {
        return 2;
      } else if (weight >= 145) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (weight >= 200) {
        return 7;
      } else if (weight >= 180) {
        return 6;
      } else if (weight >= 160) {
        return 5;
      } else if (weight >= 150) {
        return 4;
      } else if (weight >= 140) {
        return 3;
      } else if (weight >= 130) {
        return 2;
      } else if (weight >= 120) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  public getMacros(): MacroInfo {
    const userMacros = macros[this.sex][this.userProfile];
    userMacros.percentProtein = Math.round(((userMacros.protein * 4) / userMacros.calories) * 100);
    userMacros.percentCarbs = Math.round(((userMacros.carbs * 4) / userMacros.calories) * 100);
    userMacros.percentFats = Math.round(((userMacros.fats * 9) / userMacros.calories) * 100);
    const totalPercents = userMacros.percentProtein + userMacros.percentCarbs + userMacros.percentFats;
    if (totalPercents !== 100) {
      userMacros.percentProtein += 100 - totalPercents;
    }
    return userMacros;
  }

  public nutritionValue(category: CategoryTypes, name: string) {
    const data = values[this.numberOfMeals][this.sex][category];
    const itemNo = this.index[category].findIndex((item) => {
      return item === name;
    });
    return data[itemNo][this.userProfile];
  }
}
