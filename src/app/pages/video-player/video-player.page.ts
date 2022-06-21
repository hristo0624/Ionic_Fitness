import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LiveStreamError } from '../live-stream/live-stream.page';
import { FeedItem, LiveChatFeedService } from '../../services/live-chat-feed/live-chat-feed.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Video, VideosService } from '../../services/videos/videos.service';

@Component({
  selector: 'app-video-player-page',
  templateUrl: './video-player.page.html',
  styleUrls: ['./video-player.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPlayerPage implements OnInit {
  // State variables.
  public settingUpLiveStream = false;
  public liveStreamError?: LiveStreamError = null;
  feedItems: any[] = [];
  public video: Video = null;

  constructor(
    private videoService: VideosService,
    private liveChatFeed: LiveChatFeedService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
  ) {

  }

  /**
   * Executes the ionRefresh event of the ion-refresher component
   * @param event ionRefresh event object
   */
  reloadFeed(event: any){
    this.setupFeed();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  public clearErrors() {
    this.liveStreamError = null;
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
        this.initializeFeedItems(items);
      })
      .catch((e) => {
        console.log(e);
        throw new Error(LiveStreamError.NO_MESSAGES);
      });
  }

  public localTimestamp(ts) {
    return moment.utc(ts).local().format('LT');
  }

  public setupLiveStreamVideo() {
    this.settingUpLiveStream = true;
    this.clearErrors();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async pmap => {
      const streamId = +pmap.get('id');
      this.videoService.getVideo(streamId)
        .then((videoContent) => {
          this.video = videoContent;
          this.setupFeed();
        });
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

}
