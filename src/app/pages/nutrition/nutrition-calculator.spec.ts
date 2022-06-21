import { TestBed } from '@angular/core/testing';
import { NutritionCalculator } from './nutrition-calculator';
import { Sex } from '../../services/onboarding/onboarding.service';
import { Transphormer } from '../../services/authentication/authentication.service';

enum GOAL {
  LOSE = 'Primarily lose bodyfat',
  MAINTAIN = 'Maintain',
  GAIN = 'Gain lean muscle',
}

describe('NutritionCalculator', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const male = {sex: Sex.Male, transphormation_goal: GOAL.GAIN};
  const maintain = {sex: Sex.Male, transphormation_goal: GOAL.MAINTAIN};
  const female = {sex: Sex.Female, transphormation_goal: GOAL.LOSE};

  it('should be created', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service).toBeTruthy();
  });

  it('should return correct base profiles', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service.getBaseProfile('male', 130)).toBe(0);
    expect(service.getBaseProfile('male', 150)).toBe(1);
    expect(service.getBaseProfile('male', 165)).toBe(2);
    expect(service.getBaseProfile('male', 190)).toBe(3);
    expect(service.getBaseProfile('male', 205)).toBe(4);
    expect(service.getBaseProfile('male', 240)).toBe(5);
    expect(service.getBaseProfile('male', 270)).toBe(6);
  });

  it('should properly modify base profiles with goal', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service.getModifiedProfile(0, GOAL.LOSE, 'male')).toBe(0);
    expect(service.getModifiedProfile(0, GOAL.MAINTAIN, 'male')).toBe(0);
    expect(service.getModifiedProfile(0, GOAL.GAIN, 'male')).toBe(1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, GOAL.LOSE, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE - 1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, GOAL.MAINTAIN, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, GOAL.GAIN, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE);

    expect(service.getModifiedProfile(0, GOAL.LOSE, 'female')).toBe(0);
    expect(service.getModifiedProfile(0, GOAL.MAINTAIN, 'female')).toBe(0);
    expect(service.getModifiedProfile(0, GOAL.GAIN, 'female')).toBe(1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, GOAL.LOSE, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE - 1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, GOAL.MAINTAIN, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, GOAL.GAIN, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE);
  });

  it('should handle loss', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>female, 190, 4);
    expect(service.getMacros().calories).toEqual(1821);
    expect(service.getMacros().protein).toEqual(180);
    expect(service.getMacros().fats).toEqual(45);
    expect(service.getMacros().carbs).toEqual(174);
  });

  it('should handle gains', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 165, 4);
    expect(service.getMacros().calories).toEqual(2082);
    expect(service.getMacros().protein).toEqual(204);
    expect(service.getMacros().fats).toEqual(50);
    expect(service.getMacros().carbs).toEqual(204);
  });

  it('should handle maintain', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>maintain, 240, 4);
    expect(service.getMacros().calories).toEqual(2319);
    expect(service.getMacros().protein).toEqual(240);
    expect(service.getMacros().fats).toEqual(55);
    expect(service.getMacros().carbs).toEqual(216);
  });

});
