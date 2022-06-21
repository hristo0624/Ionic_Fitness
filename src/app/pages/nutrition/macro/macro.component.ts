import { Component, Input, OnInit } from '@angular/core';
import { MacroInfo } from '../nutrition-calculator';

@Component({
  selector: 'app-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss']
})
export class MacroComponent implements OnInit {

  @Input()
  public set bmr(result: MacroInfo) {
    this.protein.value = result.protein;
    this.protein.percentage = result.percentProtein;
    this.carbs.value = result.carbs;
    this.carbs.percentage = result.percentCarbs;
    this.fat.value = result.fats;
    this.fat.percentage = result.percentFats;
    this.cals.value = result.calories;
  }

  public cals = {
    value: 0
  };

  public protein = {
    value: 0,
    percentage: 0
  };

  public fat = {
    value: 0,
    percentage: 0
  };

  public carbs = {
    value: 0,
    percentage: 0
  };

  constructor() {
  }

  ngOnInit() {
  }

}
