import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  public termsCheck = false;

  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  public accept() {
    this.modalCtrl.dismiss(true);
  }

  public close() {
    this.modalCtrl.dismiss(false);
  }
}
