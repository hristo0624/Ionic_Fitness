import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import * as moment from 'moment';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { Video, Videos, VideosService } from '../../services/videos/videos.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { Subject } from 'rxjs';
import { PusherService } from '../../services/pusher/pusher.service';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.page.html',
  styleUrls: ['./live-streaming.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiveStreamingPage implements OnInit, OnDestroy {
  public playerEvents = new Subject<string>();

  public videos: Videos = {
    videos: [],
    active_stream: null
  };
  public liveVideo: Video;
  private pusher: { pusher: any ; channel: any; close(): void };
  public playing = false;
  private liveStreamDisconnected = true;

  constructor(
    private navCtrl: NavController,
    private videosService: VideosService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    public modalCtrl: ModalController,
    public pusherService: PusherService,
    private analyticService: AnalyticsService
  ) {
  }

  public ngOnInit() {
    this.setupLiveStreamWatcher();
    this.setupLivestreamVideos().then();
  }

  public setupLiveStreamWatcher() {
    this.pusher = this.pusherService.getGeneralStreamChannel();
    this.pusher.channel.bind('App\\Events\\Mux\\StreamGoingLive', (s) => {
      this.videosService.clearVideosCache();
      this.navCtrl.navigateForward('live-stream').then();
      this.liveStreamDisconnected = false;
    });
    this.pusher.channel.bind('App\\Events\\Mux\\StreamDisconnected', (s) => {
      this.videosService.clearVideosCache();
      if (!this.playing) {
        this.liveVideo = null;
      }
      this.liveStreamDisconnected = true;
    });
    this.pusher.channel.bind('App\\Events\\Mux\\StreamIdle', (s) => {
      this.liveVideo = null;
    });
  }

  public videoError() {
    if (this.liveStreamDisconnected) {
      this.playerEvents.next('pause');
      this.liveVideo = null;
    }
  }

  public ngOnDestroy() {
    this.pusher.close();
  }

  public async refreshContent(event) {
    await this.setupLivestreamVideos();
    event.target.complete();
  }

  public async setupLivestreamVideos() {
    try {
      this.videos = <Videos>await this.videosService.getVideos(100);
      this.liveVideo = this.videos.active_stream;
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  sendPlayerEvent(action: string) {
    this.playerEvents.next(action);
  }

  public goToLiveStream() {
    this.sendPlayerEvent('pause');
    this.navCtrl.navigateForward('live-stream');
    this.analyticService.logEvent(AnalyticEvents.WatchingLiveStream, {});
  }

  public async openVideo(video: Video) {
    this.sendPlayerEvent('pause');
    this.navCtrl.navigateForward('live-stream/' + video.id);
  }

  public videoDate(video: Video): string {
    const publishedOn = moment(video.publish_date);
    const currentTime = moment();

    const diff = Math.abs(currentTime.diff(publishedOn, 'days'));
    if (diff === 0) {
      return 'Today';
    }
    if (diff === 1) {
      return 'Yesterday';
    }
    return publishedOn.fromNow();
  }

  public publishDate(video: Video): string {
    const date = new Date(video.length);

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    let timestamp = '';

    if (hours > 0) {
      timestamp += hours + ':';
    }
    if (minutes < 10) {
      timestamp += '0';
    }
    timestamp += minutes + ':';

    if (seconds < 10) {
      timestamp += '0';
    }
    return timestamp + seconds;
  }
}
