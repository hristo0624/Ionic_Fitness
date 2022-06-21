import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveStreamPage } from './live-stream.page';
import { FeedItem, LiveChatFeedService } from '../../services/live-chat-feed/live-chat-feed.service';
import { LivestreamingService, LiveToken } from '../../services/livestreaming/livestreaming.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ToastMock } from '../../mocks';
import { By } from '@angular/platform-browser';

class MockLiveStreamFeed {
  sendMessage() {
    return Promise.resolve({});
  }

  getNewItemsForStream() {
    return Promise.resolve([]);
  }

  getAllMessagesForStream() {
    return Promise.resolve([]);
  }
}

class MockLiveStreamService {
  public getlivestreamToken() {
    return Promise.resolve(<LiveToken>{
      account_id: 5,
      secure_token: 'abcdef',
      client_id: 5949,
      timestamp: 1558501200,
    });
  }

  public getlivestreamVideos() {
    return Promise.resolve({
      unavailable: false,
      videos: null,
      live_videos: [{
        type: 'video',
        data: {
          id: '12345678',
          m3u8: 'https://sample.com/'
        },
        event_info: {
          id: 123456,
          isLive: true
        }
      }]
    });
  }
}


class MockLiveStreamServiceNonfunctioning {
  getlivestreamToken() {
    return Promise.resolve(<LiveToken>{
      account_id: 5,
      secure_token: 'abcdef',
      client_id: 5949,
      timestamp: 1558501200,
    });
  }

  getlivestreamVideos() {
    return Promise.resolve({
      unavailable: false,
      videos: null,
      live_videos: null
    });
  }
}

describe('LiveStreamPage', () => {
  let component: LiveStreamPage;
  let fixture: ComponentFixture<LiveStreamPage>;

  function buildComponent() {
    return TestBed.configureTestingModule({
      declarations: [LiveStreamPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: LiveChatFeedService, useClass: MockLiveStreamFeed},
        {provide: LivestreamingService, useClass: MockLiveStreamServiceNonfunctioning},
        {provide: ToastService, useClass: ToastMock}
      ]
    });
  }

  function compileComponent() {
    buildComponent().compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(LiveStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    compileComponent();
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display a message if there is no current live video', async () => {
    compileComponent();
    createComponent();
    await fixture.detectChanges();
    await fixture.whenStable();
    const debugElement = fixture.debugElement;
    const errorDiv = debugElement.query(By.css('.error'));
    const divEl: HTMLDivElement = errorDiv.nativeElement;
    expect(divEl.textContent).toContain('No live stream was available.');
    expect(component.settingUpLiveStream).toBeFalsy();
    expect(component.liveStreamError).toBeTruthy();
  });

  it('should display a message if we could not get a token', async () => {
    const c = buildComponent();
    c.overrideProvider(LivestreamingService, {
      useValue: {
        getlivestreamToken() {
          return Promise.reject('Error');
        },
        getlivestreamVideos() {
          return Promise.resolve({
            unavailable: false,
            videos: null,
            live_videos: [{
              type: 'video',
              data: {
                id: '12345678',
                m3u8: 'https://sample.com/'
              },
              event_info: {
                id: 123456,
                isLive: true
              }
            }]
          });
        }
      }
    });
    c.compileComponents();
    createComponent();
    await fixture.whenStable();
    await fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const errorDiv = debugElement.query(By.css('.error'));
    const divEl: HTMLDivElement = errorDiv.nativeElement;
    expect(divEl.textContent).toContain('Unable to connect to server.');
    expect(component.settingUpLiveStream).toBeFalsy();
    expect(component.liveStreamError).toBeTruthy();
  });

  it('should display a message if there is no current live video', async () => {
    compileComponent();
    createComponent();
    await fixture.whenStable();
    await fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const errorDiv = debugElement.query(By.css('.error'));
    const divEl: HTMLDivElement = errorDiv.nativeElement;
    expect(divEl.textContent).toContain('No live stream was available.');
    expect(component.settingUpLiveStream).toBeFalsy();
    expect(component.liveStreamError).toBeTruthy();
  });

  it('should display a message if we could not get a token', async () => {
    const c = buildComponent();
    c.overrideProvider(LivestreamingService, {
      useValue: {
        getlivestreamToken() {
          return Promise.reject('Error');
        },
        getlivestreamVideos() {
          return Promise.resolve({
            unavailable: false,
            videos: null,
            live_videos: [{
              type: 'video',
              data: {
                id: '12345678',
                m3u8: 'https://sample.com/'
              },
              event_info: {
                id: 123456,
                isLive: true
              }
            }]
          });
        }
      }
    });
    c.compileComponents();
    createComponent();
    await fixture.whenStable();
    await fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const errorDiv = debugElement.query(By.css('.error'));
    const divEl: HTMLDivElement = errorDiv.nativeElement;
    expect(divEl.textContent).toContain('Unable to connect to server.');
    expect(component.settingUpLiveStream).toBeFalsy();
    expect(component.liveStreamError).toBeTruthy();
  });

  it('should properly load the video with token information', async () => {
    const c = buildComponent();
    c.configureTestingModule({
      providers: [
        {provide: LivestreamingService, useClass: MockLiveStreamService},
      ]
    });
    c.compileComponents();

    fixture = TestBed.createComponent(LiveStreamPage);
    component = fixture.componentInstance;
    spyOn(component, 'subscribeToFeedUpdates').and.returnValue(null);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.detectChanges();
    expect(component.settingUpLiveStream).toBeFalsy();
    expect(component.liveStreamError).toBeFalsy();
  });

  it('should handle there being no messages on a live stream', async () => {
    const c = buildComponent();
    c.configureTestingModule({
      providers: [
        {provide: LivestreamingService, useClass: MockLiveStreamService},
        {
          provide: LiveChatFeedService, useValue: {
            getNewItemsForStream() {
              return Promise.resolve([]);
            },
            getAllMessagesForStream() {
              return Promise.resolve([]);
            }
          }
        }
      ]
    });
    c.compileComponents();

    fixture = TestBed.createComponent(LiveStreamPage);
    component = fixture.componentInstance;
    const a = TestBed.get(LiveChatFeedService);
    spyOn(a, 'getNewItemsForStream').and.returnValues([
      Promise.resolve([]),
      Promise.resolve([])
    ]);
    spyOn(component, 'subscribeToFeedUpdates').and.callThrough().and.returnValue(null);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.detectChanges();
    expect(component.feedItems).toEqual([]);
    expect(component.subscribeToFeedUpdates).toHaveBeenCalledTimes(1);
  });

  it('should load messages if there is a live stream', async () => {
    const c = buildComponent();
    c.configureTestingModule({
      providers: [
        {provide: LivestreamingService, useClass: MockLiveStreamService},
        {
          provide: LiveChatFeedService, useValue: {
            getNewItemsForStream() {
              return Promise.resolve([]);
            },
            getAllMessagesForStream() {
              return Promise.resolve([]);
            }
          }
        }
      ]
    });
    c.compileComponents();

    fixture = TestBed.createComponent(LiveStreamPage);
    component = fixture.componentInstance;
    spyOn(component, 'subscribeToFeedUpdates').and.returnValue(null);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.detectChanges();
    expect(component.feedItems).toEqual([]);
  });

  it('should handle messages', async () => {
    const c = buildComponent();
    c.configureTestingModule({
      providers: [
        {provide: LivestreamingService, useClass: MockLiveStreamService},
        {
          provide: LiveChatFeedService, useValue: {
            getNewItemsForStream() {
              return Promise.resolve([

              ]);
            },
            getAllMessagesForStream(): Promise<FeedItem[]> {
              return Promise.resolve(<FeedItem[]>[
                {
                  id: 1,
                  text: 'One',
                  author: 'Author 1',
                  sticky: false,
                  special: false,
                  approved_at: '2019-05-22 15:30:22',
                  created_at: '2019-05-22 15:30:22',
                  updated_at: '2019-05-22 15:30:22'
                }
              ]);
            }
          }
        }
      ]
    });
    c.compileComponents();

    fixture = TestBed.createComponent(LiveStreamPage);
    component = fixture.componentInstance;
    component.ngOnInit = () => {};
    await component.setupCurrentLiveEvent();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.setupFeed();
    spyOn(component, 'subscribeToFeedUpdates').and.returnValue(null);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.detectChanges();
    expect(component.feedItems.length).toBe(1);
  });
});
