import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  GroupParticipants,
  MessageService,
} from '../../services/message/message.service';
import { Transphormer } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-transphormer-group-messages',
  templateUrl: './transphormer-group-messages.page.html',
  styleUrls: ['./transphormer-group-messages.page.scss'],
})
export class TransphormerGroupMessagesPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public errorService: ErrorsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private messageService: MessageService
  ) {
  }

  public groups: GroupParticipants[] = [];

  ngOnInit() {
    this.setupGroups();
  }

  public goToTransphormerGroupChat(group: GroupParticipants) {
    this.navCtrl.navigateForward(`group-messages/${group.group_name}`);
  }

  public async setupGroups() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      this.groups = <GroupParticipants[]>await this.messageService.userGroups();
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

  public transphormerCount(group: GroupParticipants): number {
    return group.group.filter(grp => !grp.is_trainer).length;
  }

  public trainer(group: GroupParticipants): Transphormer {
    return group.group.find(grp => grp.is_trainer).transphormer;
  }
}
