import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public form: FormGroup;

  constructor(
    public errorService: ErrorsService,
    private authenticationService: AuthenticationService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public async submit() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
    });

    await loader.present();

    try {
      await this.authenticationService.forgotPassword(
        this.form.get('email').value
      );
      const toast = await this.toastCtrl.create({
        message: 'An email has been sent with link to reset password',
        duration: 3000,
      });
      toast.present();
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(e),
        duration: 3000,
      });

      toast.present();
    } finally {
      loader.dismiss();
      this.navCtrl.back();
    }
  }
}
