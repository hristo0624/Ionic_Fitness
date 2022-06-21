import { AdvisorService } from './../../../services/advisor/advisor.service';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Moment } from 'moment';
import { Events, NavController } from '@ionic/angular';
import { Assessment } from '../../../services/assessments/assessments.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message/message.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';

@Component({
  selector: 'advisor-assessment-detail',
  templateUrl: './assessment-detail.page.html',
  styleUrls: ['./assessment-detail.page.scss'],
})
export class AssessmentDetailPage implements OnInit {

  public assessment: Assessment;
  public transphormerId: any;
  public transphormerName: string;
  public listFilter: string;
  public weekStart: Moment;
  public weekEnd: Moment;
  public messageForm: FormGroup;
  public messageFormOpen = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public advisorService: AdvisorService,
    private messageService: MessageService,
    private toastSvc: ToastService,
    public events: Events
  ) {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  ionViewDidLeave() {
    this.events.publish('filter:changed', this.listFilter);
  }

  /**
   * OnInit angular event for the current view
   */
  ngOnInit() {

    // parse assessment id from url
    this.route.paramMap.subscribe(pmap => this.loadAdvisorAssessment(pmap.get('id')));

    // parse other params from the url
    this.route.queryParams.subscribe((res: Params) => {
      this.transphormerName = res['displayName'];
      this.weekStart = moment(res['weekStart']);
      this.weekEnd = moment(res['weekEnd']);
      this.transphormerId = res['transphormerId'];
      this.listFilter = res['listFilter'];
    });
  }

  /**
   * Gets the info of an assesment from the advisor services and returns the info to the view
   * @param id the assessment id
   */
  public loadAdvisorAssessment(id: string) {
    this.advisorService.getAdvisorAssessment(id).then(async (assessmentResponse: Assessment) => {

      this.assessment = assessmentResponse;

      // chart component on the body metrics require Moment objects on logged_on
      for (const weight of this.assessment.body_metrics) {
        weight.logged_on = moment(weight.logged_on);
      }

      this.markAssessmentAsReviewed(id);

    });
  }

  /**
   * Marks an assessment with reviewed=true state
   * @param id the assessment id
   */
  public markAssessmentAsReviewed(id: string) {
    this.advisorService.markAssessmentAsReviewed(id).then(async (assessmentReviewedResponse) => {
      this.events.publish('assessment-list:update', +id, true);
    });
  }

  public goToProfile() {
    this.navCtrl.navigateForward('details/' + this.transphormerId);
  }

  public goToChat() {
    this.navCtrl.navigateForward(`chat-messages/${this.transphormerId}`);
  }

  public async sendMessage() {
    try {
      await this.messageService.sendMessage(
        this.assessment.transphormer.id,
        this.messageForm.get('message').value
      );
      this.messageForm.reset();
      this.messageFormOpen = false;
      this.toastSvc.flash('Message sent!');
    } catch (e) {
      this.toastSvc.flash('Unable to send message.');
    }
  }
}
