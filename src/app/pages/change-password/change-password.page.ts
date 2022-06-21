import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../services/errors/errors.service';
import { ProfileService } from '../../services/profile/profile.service';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public form: FormGroup;

  constructor(
    public errorService: ErrorsService,
    protected profileService: ProfileService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      old_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }

  public async submit() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const data = this.form.getRawValue();
      await this.profileService.changePassword(
        data.old_password,
        data.password,
        data.password_confirmation
      );

      const toast = await this.toastCtrl.create({
        message: 'Password changed successfully',
        duration: 3000,
      });
      await toast.present();

      this.form.reset();
      this.navCtrl.navigateRoot('/dashboard');
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
