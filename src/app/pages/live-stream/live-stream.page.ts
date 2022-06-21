import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonContent, IonTextarea } from '@ionic/angular';
import { FeedItem, LiveChatFeedService } from '../../services/live-chat-feed/live-chat-feed.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import * as moment from 'moment';
import { ErrorFormat } from '../../services/errors/errors.service';
import { PusherService } from '../../services/pusher/pusher.service';
import { Video, VideosService } from '../../services/videos/videos.service';

export enum LiveStreamError {
  NO_LIVE_STREAM = 'No live stream was available.',
  UNABLE_CONNECT = 'Unable to connect to server.',
  NO_MESSAGES = 'Unable to connect to message stream.',
  // PLAYBACK = 'Could not play back stream.'
}

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiveStreamPage implements OnInit, OnDestroy {

  // Variables for messaging and feed.
  @ViewChild('messageContent') public messageContent: IonContent;
  @ViewChild('messageInput') public messageInput: IonTextarea;
  feedItems: any[] = [];
  public messageText: string;

  // State variables.
  public settingUpLiveStream = false;
  public liveStreamError?: LiveStreamError = null;
  public video: Video;
  private messageStream: { pusher: any; channel: any; close(): void };
  streamHasEnded = false;
  private generalStream: { pusher: any; channel: any; close(): void };
  private streamDisconnected = false;

  constructor(
    private liveChatFeed: LiveChatFeedService,
    private videoService: VideosService,
    private pusher: PusherService,
    private toastSvc: ToastService
  ) {
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public updateItems(items) {
    if (items.length < 1) {
      return;
    }
    items.forEach((i) => {
      const exists = this.feedItems.findIndex((item) => {
        return item.id === i.id;
      });
      if (exists !== -1) {
        if (!i.approved_at) {
          this.feedItems.splice(exists, 1);
        } else {
          this.feedItems.splice(exists, 1, i);
        }
        return;
      }
      this.feedItems.push(i);
    });
  }

  public get sortedItems() {
    return this.feedItems.sort((a, b) => {
      if (a.sticky === b.sticky) {
        return a.approved_at > b.approved_at ? -1 : 1;
      } else {
        return a.sticky ? -1 : 1;
      }
    });
  }

  ngOnInit() {
    this.setupLiveStreamVideo();
  }

  public initializeFeedItems(items: FeedItem[]) {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }
    this.feedItems = <FeedItem[]>(items);
  }

  public setupFeed(): Promise<void> {
    return this.liveChatFeed
      .getAllMessagesForStream(this.video.id)
      .then((items: FeedItem[]) => {
        this.subscribeToFeedUpdates();
        this.initializeFeedItems(items);
      })
      .catch((e) => {
        throw new Error(LiveStreamError.NO_MESSAGES);
      });
  }

  public ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.close();
    }
  }

  public subscribeToFeedUpdates() {
    this.messageStream = this.pusher
      .getChannelForLiveStream(this.video.id);
    this.generalStream = this.pusher.getGeneralStreamChannel();
    this.messageStream.channel.bind('App\\Events\\LiveStream\\FeedItemSaved', (fi) => {
      this.updateItems([fi.feedItem]);
    });
    this.messageStream.channel.bind('App\\Events\\LiveStream\\StreamEnded', () => {
      this.endStream();
    });
    this.generalStream.channel.bind('App\\Events\\Mux\\StreamDisconnected', () => {
      this.streamDisconnected = true;
    });
  }

  public playbackProblem() {
    if (this.streamDisconnected) {
      this.endStream();
    }
  }

  public endStream() {
    this.streamHasEnded = true;
    this.video = null;
  }

  public sendMessage() {
    this.liveChatFeed
      .sendMessage(this.video.id, this.messageText)
      .then(() => {
        this.toastSvc.flash('Message sent to moderation queue.');
        this.messageText = '';
      })
      .catch(() => {
        this.toastSvc.flash('Could not send message. Try again in a moment.');
      });
  }

  public getCurrentLiveEvent(): Promise<Video | ErrorFormat> {
    return this.videoService
      .getLatestVideo()
      .then((video: Video) => {
        if (video.live_status === 'live') {
          this.video = video;
          return this.video;
        }
      });
  }

  public initializeStreamData(video: Video) {
    this.settingUpLiveStream = false;
    if (!video) {
      throw new Error(LiveStreamError.NO_LIVE_STREAM);
    }
  }

  public setupCurrentLiveEvent() {
    return this.getCurrentLiveEvent()
      .then((video: Video) => {
        this.initializeStreamData(video);
      });
  }

  public clearErrors() {
    this.liveStreamError = null;
  }

  public setupLiveStreamVideo() {
    this.settingUpLiveStream = true;
    this.clearErrors();
    this.setupCurrentLiveEvent()
      .then(() => {
        return this.setupFeed();
      })
      .catch((error) => {
        this.settingUpLiveStream = false;
        this.liveStreamError = error.message;
      });
  }

  public localTimestamp(ts) {
    return moment.utc(ts).local().format('LT');
  }

}
