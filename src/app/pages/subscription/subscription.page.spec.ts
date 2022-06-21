import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionPage } from './subscription.page';
import {
  ErrorServiceMock,
  IABMock,
  LoadingControllerMock,
  NavMock,
  RollbarMock,
  ToastMock
} from '../../mocks';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { RollbarService } from '../../rollbar';
import { By } from '@angular/platform-browser';

class SubscriptionServiceMock {

}

describe('SubscriptionPage', () => {
  let component: SubscriptionPage;
  let fixture: ComponentFixture<SubscriptionPage>;

  const defaultProviders = [
    {provide: RollbarService, useClass: RollbarMock},
    {provide: NavController, useClass: NavMock},
    {
      provide: ActivatedRoute, useValue: {
        snapshot: {
          queryParamMap: {
            get() {
              return false;
            }
          }
        }
      }
    },
    {provide: SubscriptionService, useClass: SubscriptionServiceMock},
    {provide: LoadingController, useClass: LoadingControllerMock},
    // {provide: InAppPurchase, useClass: IAPMock},
    {provide: ToastService, useClass: ToastMock},
    {provide: ErrorsService, useClass: ErrorServiceMock},
    {provide: InAppBrowser, useClass: IABMock},
  ];

  function buildComponent(providers) {
    TestBed.configureTestingModule({
      declarations: [SubscriptionPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers
    })
      .compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(SubscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    buildComponent(defaultProviders);
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should not show android when on iOS', () => {
    const providers: any[] = defaultProviders;
    providers.push({
      provide: Platform, useValue: {
        is(val) {
          return val === 'ios';
        }
      }
    });
    buildComponent(providers);
    createComponent();

    expect(component.isIos).toBeTruthy();
    expect(component.isAndroid).toBeFalsy();
    const li = fixture.debugElement.query(By.css('.fine-print'));
    const liElement: HTMLElement = li.nativeElement;
    expect(liElement.textContent).toContain('For iOS purchases, payment will be charged to your iTunes');
    expect(liElement.textContent.indexOf('Android')).toEqual(-1);
  });

  it('should not show iOS when on Android', () => {
    const providers: any[] = defaultProviders;
    providers.push({
      provide: Platform, useValue: {
        is(val) {
          return val === 'android';
        }
      }
    });
    buildComponent(providers);
    createComponent();

    expect(component.isAndroid).toBeTruthy();
    expect(component.isIos).toBeFalsy();
    const li = fixture.debugElement.query(By.css('.fine-print'));
    const liElement: HTMLElement = li.nativeElement;
    expect(liElement.textContent).toContain('For Android purchases');
    expect(liElement.textContent.indexOf('For iOS purchases')).toEqual(-1);
  });


});
