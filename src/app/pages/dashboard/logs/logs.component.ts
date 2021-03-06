import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  public closeLogs() {
    this.modalCtrl.dismiss();
  }
}
