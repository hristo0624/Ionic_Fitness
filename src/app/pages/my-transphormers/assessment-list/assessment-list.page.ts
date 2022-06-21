import { AdvisorService, AssessmentResponse, AssessmentData } from './../../../services/advisor/advisor.service';
import { LoadingController, NavController, Events } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'advisor-assessment-list',
    templateUrl: './assessment-list.page.html',
    styleUrls: ['./assessment-list.page.scss'],
})
export class AssessmentListPage {

    public assessmentsData: AssessmentData[] = [];
    public assessment: any;
    loading: any;
    public viewUnreviewedItemsOnly: boolean;
    public tabState: string;
    public pageLoaded: boolean;

    constructor(
        public loadingController: LoadingController,
        public advisorService: AdvisorService,
        public navCtrl: NavController,
        public router: Router,
        public events: Events
    ) {

        this.viewUnreviewedItemsOnly = true;
        this.tabState = 'unreviewed';

        this.assessmentsData = [];
        this.pageLoaded = false;
        this.loadAllSinceLastUpdate();

        this.events.subscribe('filter:changed', (lastTabState) => {

            this.tabState = lastTabState;
            this.viewUnreviewedItemsOnly = this.tabState === 'unreviewed';

        });

        this.events.subscribe('assessment-list:update', (assessmentId: number, reviewed: boolean) => {
            const assessmentIndex = this.assessmentsData
              .findIndex(a => a.id === assessmentId);
            const assessment = this.assessmentsData[assessmentIndex];
            assessment.reviewed = reviewed ? 1 : 0;
            this.assessmentsData.splice(assessmentIndex, 1, assessment);
        });

     }

    /**
     * ion-refresher callback event (on page swipe down).
     * @param event the event object
     */
    reloadFeed(event: any) {
      this.loadAllSinceLastUpdate().then(() => {
        event.target.complete();
      });
    }

    /**
     * segmentChanged callback function
     * @param event the event
     */
    segmentChanged(event: any) {
        if (event !== undefined && event.detail.value === 'unreviewed') {
            this.viewUnreviewedItemsOnly = true;
            this.tabState = 'unreviewed';
        } else {
            this.viewUnreviewedItemsOnly = false;
            this.tabState = 'all';
        }
    }

    get lastUpdate(): Moment | null {
      if (this.assessmentsData.length === 0) {
        this.lastUpdate = null;
        return null;
      }
      const a = window.localStorage.getItem('advisor_assessments_last_update');
      if (a !== null) {
        return moment(JSON.parse(a));
      }
      return null;
    }

    set lastUpdate(value: Moment) {
      if (value === null) {
        window.localStorage.removeItem('advisor_assessments_last_update');
        return;
      }
      window.localStorage.setItem('advisor_assessments_last_update', JSON.stringify(value));
    }

    public async loadAllSinceLastUpdate() {
      let page = 1,
          maxPage = 1;
      do {
        await this.advisorService.getAdvisorAssessments(page, this.lastUpdate).then(async (assessmentsResponse: AssessmentResponse) => {
          maxPage = assessmentsResponse.last_page;
          this.assessmentsData = this.assessmentsData
            .concat(assessmentsResponse.data);
        });
        page++;
      } while (page <= maxPage);
      this.pageLoaded = true;
      if (this.assessmentsData.length > 0) {
        this.lastUpdate = moment(this.assessmentsData[0].updated_at);
      }
    }

    get visibleAssessments(): AssessmentData[] {
      return this.assessmentsData.filter((item) => {
        return this.viewUnreviewedItemsOnly ? item.reviewed === 0 : true;
      })
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() ? -1 : 1);
    }

    get unreviewedItemsQty() {
      return this.assessmentsData.filter(item => item.reviewed === 0).length;
    }

    /**
     * Redirects the app to the individual assessment detail view
     * @param assmt the assessment object
     */
    public openAssessmentDetail(assmt: any) {

        this.router.navigate([`advisor-assessment-detail/${assmt.id}`], {
            queryParams: {
                displayName: assmt.transphormer.display_name,
                weekStart: assmt.week_start,
                weekEnd: assmt.week_end,
                transphormerId: assmt.transphormer.id,
                listFilter: this.tabState
            },
        });

    }


}
