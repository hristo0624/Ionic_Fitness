import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Parent } from '../nutrition.page';

@Component({
  selector: 'app-calorie-counting',
  templateUrl: './calorie-counting.component.html',
  styleUrls: ['./calorie-counting.component.scss']
})
export class CalorieCountingComponent implements OnInit {

  @Input()
  public set activeParents(value: Parent[]) {
    this.parents = value;
  }

  public parents: Parent[] = [];

  @Output()
  public contentUpdated: EventEmitter<Parent[]> = new EventEmitter<Parent[]>();

  constructor() {
  }

  ngOnInit() {
  }

  public get protein(): number {
    let value = 0;
    this.parents.forEach(parent => {
      parent.food.forEach(foodContent => {
        value += foodContent.categories[0].selectedNutrition.quantity;
      });
    });

    return value;
  }

  public get carb(): number {
    let value = 0;
    this.parents.forEach(parent => {
      parent.food.forEach(foodContent => {
        value += foodContent.categories[1].selectedNutrition.quantity;
      });
    });

    return value;
  }

  public get fat(): number {
    let value = 0;
    this.parents.forEach(parent => {
      parent.food.forEach(foodContent => {
        value += foodContent.categories[2].selectedNutrition.quantity;
      });
    });

    return value;
  }

  public updateContent() {
    this.contentUpdated.emit(this.parents);
  }
}
