import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Moment } from 'moment';
import { ErrorFormat } from '../errors/errors.service';
import * as moment from 'moment';
import { Transphormer } from '../authentication/authentication.service';
import { Weight } from '../weights/weights.service';

export interface CustomMacro {
  id: number;
  reset_to_original: boolean;
  carbs: number;
  fats: number;
  protein: number;
  calories: number;
  transphormer_id: number;
  edit_date: Moment | string;
  base_weight?: Weight;
}

@Injectable({
  providedIn: 'root'
})
export class CustomMacroService extends BaseService {

  constructor(
    public http: HttpClient,
    protected platform: Platform,
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) {
    super(http, platform);
  }

  /**
   * Returns list of previously created macros
   */
  public history(): Promise<CustomMacro[] | ErrorFormat> {
    return this.http.get<CustomMacro[]>(
      CustomMacroService.Url('nutritions/custom-macros'),
      CustomMacroService.BaseOptions(true, true)
    )
      .toPromise()
      .then(result => result.map(macro => {
        macro.edit_date = moment(macro.edit_date);
        return macro;
      }))
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Creates new custom macro record
   *
   * @param reset_to_original
   * @param protein
   * @param carbs
   * @param fats
   * @param date
   */
  public create(
    reset_to_original: boolean, protein: number, carbs: number, fats: number, date: string
  ): Promise<CustomMacro | ErrorFormat> {
    const data = {
      reset_to_original,
      carbs,
      fats,
      protein,
      date
    };
    return this.http.post<CustomMacro>(CustomMacroService.Url('nutritions/custom-macros'), data, CustomMacroService.BaseOptions())
      .toPromise()
      .then(result => {
        result.edit_date = moment(result.edit_date);
        return result;
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Action to update existing custom macro record
   * @param id
   * @param reset_to_original
   * @param protein
   * @param carbs
   * @param fats
   */
  public update(
    id: number, reset_to_original: boolean, protein: number, carbs: number, fats: number
  ): Promise<CustomMacro | ErrorFormat> {
    const data = {
      reset_to_original,
      carbs,
      fats,
      protein
    };
    return this.http.patch<CustomMacro>(
      CustomMacroService.Url(`nutritions/custom-macros/${id}`), data, CustomMacroService.BaseOptions()
    )
      .toPromise()
      .then(result => {
        result.edit_date = moment(result.edit_date);
        return result;
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Returns the latest custom macro
   */
  public latestMacro(): Promise<CustomMacro | null | ErrorFormat> {
    return this.http.get<CustomMacro | null>(
      CustomMacroService.Url('nutritions/custom-macros/latest'), CustomMacroService.BaseOptions()
    )
      .toPromise()
      .then<CustomMacro | null>(result => {
        if (result.id) {
          result.edit_date = moment(result.edit_date);
          return result;
        } else {
          return null;
        }
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Notifying the user to update custom macro values if transphormer is doing calorie counting and has set custom macro with weigh diff
   * to base weight more than 10
   * @param newWeight
   */
  public async notifyToUpdateMacro(newWeight: number) {
    const transphormer: Transphormer = JSON.parse(window.localStorage.getItem('transphormer'));

    // checking if transphormer is doing calories counting and is not in standard macro
    if (transphormer.likely_to_do !== 'Calorie / Macro counting') {
      return;
    }

    let latestMacro = <CustomMacro>await this.latestMacro();
    latestMacro = latestMacro || <CustomMacro>{reset_to_original: true};

    if (latestMacro.reset_to_original) {
      return;
    }

    const diff = newWeight - latestMacro.base_weight.weight;

    if (Math.abs(diff) < 10) {
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Update your macros',
      message: `You have ${diff > 0 ? 'gained' : 'lost'} 10 pounds or more. You should update your macros.`,
      backdropDismiss: false,
      buttons: [{
        text: 'Later',
        cssClass: 'global-danger',
      }, {
        text: 'Let\'s do it',
        handler: () => {
          this.navCtrl.navigateRoot('macro?openCustomMacro=true');
        }
      }]
    });

    await alert.present();
  }
}
