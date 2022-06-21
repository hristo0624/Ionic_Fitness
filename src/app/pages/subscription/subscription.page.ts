import { Component, Inject, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  Platform
} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ActivatedRoute } from '@angular/router';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { InAppPurchaseService } from '../../services/in-app-purchase/in-app-purchase.service';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  public productFetched = false;
  public products: IAPProduct[] = [];
  public showExtra = false;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private purchaseService: InAppPurchaseService,
    private platform: Platform,
    private loaderCtrl: LoadingController,
    private toastSvc: ToastService,
    @Inject(RollbarService) private rollbar: Rollbar,
    private iab: InAppBrowser,
  ) {

    // handling subscription owned state
    this.purchaseService.ownedState.subscribe((product) => {
      this.navCtrl.navigateForward('thanks');
    });

    // handling error on store
    this.purchaseService.store.error(err => {
      // this.toastSvc.flash('Something went wrong:' + err.toString());
      this.toastSvc.flash('Something went wrong:' + JSON.stringify(err));
      console.log("Go to Premium Error = ", JSON.stringify(err));
      console.log("Go to Premium Error = ", err);
      this.rollbar.error(err);
    });
  }

  public get isIos() {
    return this.platform.is('ios');
  }

  public get isAndroid() {
    return this.platform.is('android');
  }

  public openUrl(url: string, e: Event) {
    e.preventDefault();
    this.iab.create(url, '_system', {location: 'yes'});
  }

  public async handleSubscription(productId) {
    const product = this.purchaseService.platformProducts()[productId];

    const loader = await this.loaderCtrl.create({
      message: 'Purchasing...',
    });
    await loader.present();

    const result = this.purchaseService.purchase(product);
    result.then(() => loader.dismiss());
    result.error((e) => {
      this.rollbar.error(e);
      this.toastSvc.flash('Unable to process payment: ' + e.toString());
      loader.dismiss();
    });
  }

  public close() {
    this.navCtrl.navigateRoot('dashboard');
  }

  ngOnInit() {
    this.showExtra = this.route.snapshot.queryParamMap.get('showExtra') === 'true';
    this.fetchProducts();
  }

  public get isMobile(): boolean {
    return this.platform.is('cordova');
  }

  private async fetchProducts() {
    if (!this.isMobile) {
      return;
    }

    const platform = this.isIos ? 'ios' : 'android';

    try {
      this.purchaseService.registerProducts(this.purchaseService.platformProductsArray(), platform);
      this.purchaseService.storeReady().subscribe((products) => {
        this.productFetched = true;
        this.products = products;
      });
    } catch (e) {
      this.toastSvc.flash('Could not connect to store.');
    }
  }
}
