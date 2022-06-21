import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { AssessmentStateService } from '../../pages/take-assessment/services/assessment-state/assessment-state.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentSummaryGuard implements CanActivate {

  public constructor(
    public toastService: ToastService,
    public state: AssessmentStateService,
    public router: Router
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree | boolean {
    if (this.state.questions.length === 0 || !this.checkQuestionsAreAnswered()) {
      this.toastService.flash('Please answer your assessment questions first');
      return this.router.createUrlTree(['/take-assessment']);
    }

    // @todo: handle camera photo state
    // if (!this.state.photo) {
    //   this.toastService.flash('Please take photo before submitting');
    //   return false;
    // }

    return true;
  }

  private checkQuestionsAreAnswered(): boolean {
    for (const question of this.state.questions) {
      const hasBeenAnswered = question.options.find(option => option.is_selected);
      if (!hasBeenAnswered) {
        return false;
      }
    }

    return true;
  }
}
