import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  IonContent,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LinkApplication,
  TrainerTransphormerLinkService,
} from '../../services/trainer-transphormer-link/trainer-transphormer-link.service';
import {
  MessageService,
  Message as ChatMessage,
} from '../../services/message/message.service';
import { Transphormer } from '../../services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { GlobalEmitterService, GlobalEvents } from '../../services/global-emitter/global-emitter.service';
import { AuthenticatedPusherService } from '../../services/authenticated-pusher/authenticated-pusher.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  public application: LinkApplication | null = null;

  public hasTrainer = false;
  public checkComplete = false;
  public canMessage = false;

  public messageForm: FormGroup;

  public messages: ChatMessage[] = [];

  private messageStream: Subscription;

  @ViewChild('messageContent')
  public messageContent: IonContent;


  constructor(
    private toastSvc: ToastService,
    private loadingCtrl: LoadingController,
    private linkService: TrainerTransphormerLinkService,
    public errorService: ErrorsService,
    private messageService: MessageService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private toastService: ToastService,
    private globalEmitter: GlobalEmitterService,
    public messageChannel: AuthenticatedPusherService
  ) {
  }

  ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.unsubscribe();
      this.messageChannel.closeChannel(`private-message-channel.${this.application.trainer.transphormer_id}.${this.user.id}`);
      this.messageChannel.closeEvent('message.received');
    }
  }

  ngOnInit() {
    this.checkApplicationStatus();

    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  private async checkApplicationStatus() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });

    await loader.present();

    try {
      this.application = <LinkApplication>(
        await this.linkService.requestStatus()
      );
      this.hasTrainer = true;

      if (this.application.status === 'accepted') {
        this.canMessage = true;
        await this.setupMessages();
      }
    } catch (e) {
      if (e.status !== 404) {
        this.toastSvc.flash(this.errorService.firstError(e));
      }
    } finally {
      loader.dismiss();
      this.checkComplete = true;
    }
  }

  private async setupMessages(showLoader = false) {
    let loader;

    if (!this.application) {
      this.hasTrainer = false;
    } else {
      if (showLoader) {
        loader = await this.loadingCtrl.create({
          message: 'Please wait ...',
        });
        await loader.present();
      }

      try {
        this.messages = <ChatMessage[]>(
          (<any>(
            await this.messageService.messages(
              this.application.trainer.transphormer.id
            )
          ))
        );
        this.messages = this.sortMessages();
        this.setupMessageStream();
        this.markMessagesAsRead();

        this.scrollBottom();
      } catch (e) {
        this.toastSvc.flash(this.errorService.firstError(e));
      } finally {
        if (showLoader) {
          await loader.dismiss();
        }
      }
    }
  }

  public get user(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  public async sendMessage() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      const message = <ChatMessage>(
        (<any>(
          await this.messageService.sendMessage(
            this.application.trainer.transphormer.id,
            this.messageForm.get('message').value
          )
        ))
      );
      this.messages.push(message);
      this.messageForm.reset();
      this.scrollBottom();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  private setupMessageStream() {
    this.messageChannel.openChannel(`private-message-channel.${this.application.trainer.transphormer_id}.${this.user.id}`);
    this.messageStream = this.messageChannel.openEvent<{ message: ChatMessage }>('message.received')
      .subscribe((data) => {
        this.setupLatestMessages([data.message]);
      });
  }

  private setupLatestMessages(messages: ChatMessage[]) {
    let hasNewMessage = false;
    for (const message of messages) {
      if (
        !this.messages.find(
          existingMessage => existingMessage.id === message.id
        )
      ) {
        this.messages.push(message);
        hasNewMessage = true;
      }
    }

    if (hasNewMessage) {
      this.messages = this.sortMessages();
      this.scrollBottom();
      this.markMessagesAsRead();
    }
  }

  public time(created_at: string): string {
    return moment
      .utc(created_at)
      .local()
      .format('h:mm a');
  }

  public async trainerActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove Advisor',
          icon: 'trash',
          cssClass: 'danger',
          handler: () => {
            this.removeTrainer();
          },
        },
        {
          text: 'View Advisor details',
          icon: 'eye',
          handler: () => {
            this.navCtrl.navigateForward(
              `/trainer-detail/${this.application.trainer.transphormer_id}`
            );
          },
        },
        {
          text: 'Cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  private async removeTrainer() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      await this.linkService.destroyLink(this.application.id);
      this.hasTrainer = false;
      this.canMessage = false;
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public scrollBottom() {
    window.setTimeout(() => this.messageContent.scrollToBottom(), 100);
  }

  private sortMessages() {
    return this.messages.sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)) ? -1 : 1);
  }

  public async markMessagesAsRead() {

    const unreadMessages = this.messages.filter(message => message.from_id !== this.user.id && !message.read_at);

    try {
      if (unreadMessages.length > 0) {
        const result = await this.messageService.markMessagesAsRead(unreadMessages.map(message => message.id));
        unreadMessages.forEach(message => {
          message.read_at = result.read_at;
        });
      }

      this.globalEmitter.emit(GlobalEvents.TransphormerMessageRead);
    } catch (e) {
      this.toastService.flash('Unable to mark messages as read');
    }
  }
}
