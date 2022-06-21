import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-meal-info',
  templateUrl: './meal-info.component.html',
  styleUrls: ['./meal-info.component.scss']
})
export class MealInfoComponent implements OnInit {
  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
