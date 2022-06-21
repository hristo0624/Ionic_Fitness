import { Component, Inject, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Pro as IonicPro } from '@ionic/pro';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as Rollbar from 'rollbar';
import { RollbarService } from '../../rollbar';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { InAppPurchaseService } from '../../services/in-app-purchase/in-app-purchase.service';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.page.html',
  styleUrls: ['./help-support.page.scss'],
  providers: [AppVersion]
})
export class HelpSupportPage implements OnInit {

  constructor(private platform: Platform,
              private purchaseService: InAppPurchaseService,
              private iab: InAppBrowser,
              private cachingService: RequestCachingService,
              @Inject(RollbarService) private rollbar: Rollbar,
              private toastSvc: ToastService,
              public appVer: AppVersion,
    private analyticService: AnalyticsService
  ) {
  }

  public buildVersion = '';
  public appVersion = '';
  public ionicVersion = 'default';

  ngOnInit() {
    this.setupBundleInfo();
    this.setupIonicBuildInfo();
  }

  public async setupBundleInfo() {
    try {
      if (this.platform.is('cordova')) {
        const [versionCode, versionNumber] = await Promise.all([
          this.appVer.getVersionCode(),
          this.appVer.getVersionNumber(),
        ]);

        this.buildVersion = `${versionCode}`;
        this.appVersion = versionNumber;
      }

    } catch (e) {
      console.error(e);
    }
  }

  public async viewSupportPage() {
    this.iab
      .create('https://www.mytransphormationstartstoday.com/help', '_blank');
    this.analyticService.logEvent(AnalyticEvents.HelpView, {});
  }

  public get emailHref(): string {
    let body = 'Version: ' + this.appVersion + '%0D%0A'
      + 'Build: ' + this.buildVersion + '%0D%0A'
      + 'Deployed: ' + this.ionicVersion + '%0D%0A%0D%0A';
    body = body.replace(' ', '%20');
    return `mailto:transphorm@1stphorm.com?subject=Support%20Request&body=${body}`;
  }

  public async checkPremiumSubscription() {
    const platform = this.platform.is('ios') ? 'ios' : 'android';
    this.purchaseService.store.error((e) => {
      this.rollbar.error(e);
      this.toastSvc.flash('Error refreshing subscription: ' + e);
    });
    this.purchaseService.registerProducts(this.purchaseService.platformProductsArray(), platform);
    this.purchaseService.store.refresh();
  }

  public clearCaches() {
    this.cachingService.clearAll();
    this.toastSvc.flash('Caches cleared.');
  }

  public async setupIonicBuildInfo() {
    try {
      if (this.platform.is('cordova')) {
        const currentVersion = await IonicPro.deploy.getCurrentVersion();

        if (currentVersion) {
          this.ionicVersion = currentVersion.versionId;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}
