import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public form: FormGroup;

  public token = '';

  constructor(
    public errorService: ErrorsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authenticationService: AuthenticationService,
    public navCtrl: NavController,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }

  public async submit() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
    });
    loader.present();

    try {
      await this.authenticationService.resetPassword(
        this.token,
        this.form.get('email').value,
        this.form.get('password').value,
        this.form.get('password_confirmation').value
      );
      const toast = await this.toastCtrl.create({
        message:
          'Your password has been reset. You will be redirected to login page',
      });

      await toast.present();
      window.setTimeout(() => {
        toast.dismiss();
        this.navCtrl.navigateRoot('/');
      }, 5000);
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(e),
        duration: 3000,
      });

      await toast.present();
    } finally {
      loader.dismiss();
    }
  }
}
