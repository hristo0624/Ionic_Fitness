import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-value-item',
  templateUrl: './label-value-item.component.html',
  styleUrls: ['./label-value-item.component.scss'],
})
export class LabelValueItemComponent implements OnInit {

  @Input('title')
  public _title: string;

  constructor() { }

  ngOnInit() {}

  get title() {
    if (this._title.substr(-1) !== ':') {
      return this._title + ':';
    }
    return this._title;
  }
}
