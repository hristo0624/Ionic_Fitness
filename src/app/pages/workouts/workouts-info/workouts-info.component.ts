import { ModalController } from '@ionic/angular';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-workouts-info',
  templateUrl: './workouts-info.component.html',
  styleUrls: ['./workouts-info.component.scss'],
})
export class WorkoutsInfoComponent implements OnInit {
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
