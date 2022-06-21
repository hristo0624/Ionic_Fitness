import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AssessmentIntroGuard implements CanActivate {

  constructor(private navCtrl: NavController) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const value = window.localStorage.getItem('takeAssessmentIntro');
    if (value !== 'completed') {
      this.navCtrl.navigateRoot('/take-assessment/intro');
      return false;
    }
    return true;
  }
}
