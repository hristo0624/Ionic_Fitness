import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  MessageService,
  Message as ChatMessage,
} from '../../services/message/message.service';
import { IonContent, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Transphormer } from '../../services/authentication/authentication.service';
import * as moment from 'moment';
import { GlobalEmitterService, GlobalEvents } from '../../services/global-emitter/global-emitter.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { AuthenticatedPusherService } from '../../services/authenticated-pusher/authenticated-pusher.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.page.html',
  styleUrls: ['./chat-messages.page.scss'],
})
export class ChatMessagesPage implements OnInit, OnDestroy {
  public messages: ChatMessage[] = [];

  protected toId: number;
  public name: string;
  protected groupName: string | null = null;

  public messageForm: FormGroup;

  private messageStream: Subscription;

  @ViewChild('messageContent')
  public messageContent: IonContent;

  constructor(
    public errorService: ErrorsService,
    public navCtrl: NavController,
    private messageService: MessageService,
    private toastSvc: ToastService,
    private loadingCtrl: LoadingController,
    private router: ActivatedRoute,
    private globalEmitter: GlobalEmitterService,
    private toastService: ToastService,
    public messageChannel: AuthenticatedPusherService
  ) {
  }

  ngOnDestroy(): void {
    if (this.messageStream) {
      this.messageStream.unsubscribe();
    }

    this.messageChannel.closeChannel(`private-message-channel.${this.toId}.${this.user.id}`);
    this.messageChannel.closeEvent('message.received');
  }

  ngOnInit() {
    this.name = '?';
    this.toId = parseFloat(this.router.snapshot.paramMap.get('id'));
    this.groupName = this.router.snapshot.paramMap.get('groupName');

    if (!this.groupName) {
      this.groupName = null;
    }

    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.getMessages();
  }

  private async getMessages() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });

    await loader.present();

    try {
      if (this.groupName === null) {
        this.messages = <ChatMessage[]>(
          (<any>await this.messageService.messages(this.toId))
        ).sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)) ? -1 : 1);
        this.setupMessageStream();
      }

      if (this.messages.length > 0) {
        const message = this.messages[0];
        if (message.from_id === this.toId) {
          this.name = message.message_from.display_name;
        } else {
          this.name = message.message_to.display_name;
        }
      }

      this.markMessagesAsRead();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
      this.scrollBottom();
    }
  }

  public async sendMessage() {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...',
    });
    await loader.present();

    try {
      let message;

      if (this.groupName === null) {
        message = <ChatMessage>(
          (<any>(
            await this.messageService.sendMessage(
              this.toId,
              this.messageForm.get('message').value
            )
          ))
        );
      } else {
        message = <ChatMessage>(
          (<any>(
            await this.messageService.sendGroupMessage(
              this.groupName,
              this.messageForm.get('message').value
            )
          ))
        );
      }
      this.messages.push(message);
      this.messageForm.reset();

      this.scrollBottom();
    } catch (e) {
      this.toastSvc.flash( this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public get user(): Transphormer {
    return JSON.parse(window.localStorage.getItem('transphormer'));
  }

  private setupMessageStream() {
    this.messageChannel.openChannel(`private-message-channel.${this.toId}.${this.user.id}`);
    this.messageStream = this.messageChannel.openEvent<{ message: ChatMessage }>('message.received')
      .subscribe((data) => {
        this.setupLatestMessages([data.message]);
      });
  }

  private setupLatestMessages(messages: ChatMessage[]) {
    let hasLatestMessage = false;
    for (const message of messages) {
      if (
        !this.messages.find(
          existingMessage => existingMessage.id === message.id
        )
      ) {
        this.messages.push(message);
        hasLatestMessage = true;
      }
    }

    if (hasLatestMessage) {
      this.messages = this.sortMessages();
      this.scrollBottom();
      this.markMessagesAsRead();
    }
  }

  public scrollBottom() {
    window.setTimeout(() => { this.messageContent.scrollToBottom(); }, 300);
  }

  public viewTransphormer() {
    this.navCtrl.navigateForward(`details/${this.toId}`);
  }

  public time(created_at: string): string {
    return moment
      .utc(created_at)
      .local()
      .format('M/D/YYYY @ h:mm a');
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
        this.globalEmitter.emit(GlobalEvents.AdvisorMessageRead, { messages: unreadMessages, transphormerId: unreadMessages[0].from_id });
      }
    } catch (e) {
      this.toastService.flash('Unable to mark messages as read.');
    }
  }
}
