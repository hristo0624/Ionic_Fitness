import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorFormat, ErrorsService } from '../../services/errors/errors.service';
import {
  LoadingController,
  NavController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import {
  AuthenticationService,
  TRANSPHORMER_ACCOUNT
} from '../../services/authentication/authentication.service';
import { TermsComponent } from './terms/terms.component';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public form: FormGroup;

  public password = 'password';
  public acceptedAgreement = false;

  // public trainer: 0;

  constructor(
    public errorHandler: ErrorsService,
    public navCtrl: NavController,
    private authenticationService: AuthenticationService,
    private loadingCtrl: LoadingController,
    public errorService: ErrorsService,
    public toastCtrl: ToastController,
    private modal: ModalController,
    private firebase: FirebaseService
  ) {
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      account_type: new FormControl(TRANSPHORMER_ACCOUNT),
    });
  }

  public async terms() {
    if (!this.acceptedAgreement) {
      const termsModal = await this.modal.create({
        component: TermsComponent,
        backdropDismiss: false,
      });
      await termsModal.present();
      const result = await termsModal.onDidDismiss();
      this.acceptedAgreement = result.data;
    }

    if (this.acceptedAgreement) {
      this.register();
    }

  }

  public async register() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
    });

    await loader.present();

    try {
      await this.authenticationService.register(
        this.form.get('email').value,
        this.form.get('password').value,
        this.form.get('first_name').value,
        this.form.get('last_name').value,
        this.form.get('account_type').value
      );
      this.firebase.saveTokenToServer(this.firebase.token());

      const toast = await this.toastCtrl.create({
        message:
          'Registration is successful.',
        duration: 3000,
      });
      await toast.present();
      this.navCtrl.navigateRoot('info-gathering');
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(<ErrorFormat>e),
        duration: 3000,
      });
      await toast.present();
    } finally {
      loader.dismiss();
    }
  }
}
