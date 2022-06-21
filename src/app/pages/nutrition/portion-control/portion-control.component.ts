import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Parent } from '../nutrition.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { Transphormer } from '../../../services/authentication/authentication.service';
import { FoodGuideComponent } from '../food-guide/food-guide.component';

@Component({
  selector: 'app-portion-control',
  templateUrl: './portion-control.component.html',
  styleUrls: ['./portion-control.component.scss']
})
export class PortionControlComponent {

  @Input()
  public set activeParents(value: Parent[]) {
    this.parents = value;
  }

  @Input()
  public showAmounts = true;

  @Output()
  public saveNutrition: EventEmitter<Parent[]> = new EventEmitter<Parent[]>();

  @Output()
  public pickedItem: EventEmitter<Category> = new EventEmitter<Category>();

  @Input()
  public showPdf = false;

  public parents: Parent[] = [];

  constructor(public iab: InAppBrowser,
              public navCtrl: NavController,
              public modalCtrl: ModalController
  ) {
  }

  public updateNutritionValue() {
    this.saveNutrition.emit(this.parents);
  }

  public pickItem(category: Category) {
    this.pickedItem.emit(category);
  }

  public getUser(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  public shouldShowHelp() {
    return (this.getUser().likely_to_do !== 'Macro meal plan')
      && ((localStorage.getItem('hidePortionControlHelp') || '0') === '0');
  }

  public portionControlHelpHidden() {
    return (this.getUser().likely_to_do !== 'Macro meal plan')
      && ((localStorage.getItem('hidePortionControlHelp') || '0') !== '0');
  }

  public hideHelp() {
    localStorage.setItem('hidePortionControlHelp', '1');
  }

  public showHelp() {
    localStorage.setItem('hidePortionControlHelp', '0');
  }

  public goTo(url) {
    this.navCtrl.navigateRoot(url);
  }

  public async openPdf() {
    const foodGuideModal = await this.modalCtrl.create({
      component: FoodGuideComponent
    });

    await foodGuideModal.present();
  }
}
