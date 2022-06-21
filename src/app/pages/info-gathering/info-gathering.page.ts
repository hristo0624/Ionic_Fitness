import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
} from '@ionic/angular';
import {
  BaseInfo,
  MarketingInfo,
  OnboardingService,
  PersonalInfo,
} from '../../services/onboarding/onboarding.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { Transphormer } from '../../services/authentication/authentication.service';
import { ToastService } from '../../services/toast-service/toast-service.service';

@Component({
  selector: 'app-info-gathering',
  templateUrl: './info-gathering.page.html',
  styleUrls: ['./info-gathering.page.scss'],
})
export class InfoGatheringPage implements OnInit {
  public step = 1;

  protected personalInfo: PersonalInfo;
  protected baseInfo: BaseInfo;
  protected marketingInfo: MarketingInfo;

  constructor(
    protected loadingCtrl: LoadingController,
    protected navCtrl: NavController,
    protected toastSvc: ToastService,
    public errorService: ErrorsService,
    protected onboardService: OnboardingService
  ) {
  }

  ngOnInit() {
  }

  public setupPersonalInfo(personalInfo: PersonalInfo) {
    this.personalInfo = personalInfo;
    this.moveToStep2();
  }

  public setupBaseInfo(baseInfo: BaseInfo) {
    this.baseInfo = baseInfo;
    this.moveToStep3();
  }

  public moveToStep1() {
    this.step = 1;
  }

  public moveToStep2() {
    this.step = 2;
  }

  public moveToStep3() {
    this.step = 3;
  }

  /**
   * Saves the on board information collected through service
   *
   * @param marketingInfo
   */
  public async onBoard(marketingInfo: MarketingInfo) {
    this.marketingInfo = marketingInfo;
    const loader = await this.loadingCtrl.create({
      message: 'Completing registration...',
    });

    await loader.present();

    try {
      const transphormer = <Transphormer>await this.onboardService.saveOnBoard(
        this.personalInfo,
        this.baseInfo,
        this.marketingInfo
      );

      this.navCtrl.navigateRoot('subscription?showExtra=true');
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }
}
