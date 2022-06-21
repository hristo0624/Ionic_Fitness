import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Conversation,
  MessageService,
} from '../../services/message/message.service';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LoadingController,
  NavController,
} from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { GlobalEmitterService, GlobalEvents } from '../../services/global-emitter/global-emitter.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';

@Component({
  selector: 'app-trainer-messages',
  templateUrl: './trainer-messages.page.html',
  styleUrls: ['./trainer-messages.page.scss'],
})
export class TrainerMessagesPage implements OnInit, OnDestroy {
  public _conversations: Conversation[] = [];
  public conversations: Conversation[] = [];
  private _amr: Subscription;
  public unreadOnly = false;

  constructor(
    public errorService: ErrorsService,
    private toastSvc: ToastService,
    private loadingCtrl: LoadingController,
    private messageService: MessageService,
    private globalEmitter: GlobalEmitterService,
    private navCtrl: NavController,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.loadConversations();
    this._amr = this.globalEmitter.listen(GlobalEvents.AdvisorMessageRead).subscribe((next) => {
      this.markConvoRead(next.data.transphormerId);
    });
  }

  public toggleUnread() {
    this.unreadOnly = !this.unreadOnly;
    this.recalculateConversations();
  }

  public recalculateConversations() {
    let unsorted;
    if (this.unreadOnly) {
      unsorted = this._conversations.filter((item) => {
        return item.unread_count !== 0;
      });
    } else {
      unsorted = this._conversations;
    }

    if (unsorted.length > 0 && unsorted[0].last_message_received) {
      unsorted.sort((a, b) => {
        if (a.last_message_received === b.last_message_received) {
          return 0;
        }
        return a.last_message_received > b.last_message_received ? 1 : -1;
      });
    }

    this.conversations = unsorted;
  }

  public markConvoRead(transphormerId: number) {
    const convoIndex = this._conversations
      .findIndex(conversation => conversation.transphormer.id === transphormerId);
    const convo = this._conversations[convoIndex];
    convo.unread_count = 0;
    this._conversations.splice(convoIndex, 1, convo);
  }

  ngOnDestroy() {
    this._amr.unsubscribe();
  }

  private async loadConversations() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading messages...',
    });
    await loader.present();

    try {
      this._conversations = <Conversation[]>(
        (<any>await this.messageService.advisorConversations())
      );
      this.analyticService.logEvent(AnalyticEvents.MessagingWithTrainer, {});
      this.recalculateConversations();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }

  public goToMessages(id: number) {
    this.navCtrl.navigateForward(`chat-messages/${id}`);
  }
}
