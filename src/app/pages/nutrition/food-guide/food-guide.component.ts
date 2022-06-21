import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-food-guide',
  templateUrl: './food-guide.component.html',
  styleUrls: ['./food-guide.component.scss'],
})
export class FoodGuideComponent {

  constructor(private modalCtrl: ModalController) {
  }

  public close() {
    this.modalCtrl.dismiss();
  }

}
