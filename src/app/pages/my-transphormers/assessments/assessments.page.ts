import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvisorService, AssessmentData } from '../../../services/advisor/advisor.service';
import { Transphormer } from '../../../services/authentication/authentication.service';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import * as moment from 'moment';
import { Assessment } from '../../../services/assessments/assessments.service';
import { MessageService } from '../../../services/message/message.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {

  public transphormerId: number;
  public transphormer: Transphormer;
  public assessments: AssessmentData[] = [];
  public assessment: AssessmentData;
  public loadingAssessment = false;
  public assessmentData?: Assessment;
  private assessmentIndex: number;
  public messageFormOpen = false;
  public messageForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private advisorService: AdvisorService,
    private trainerTransphormerService: TrainerTransphormerService,
    private messageService: MessageService,
    private toastSvc: ToastService,
  ) {
    this.route.paramMap.subscribe(pmap => this.loadTransphormerAssessments(+pmap.get('id')));
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  public loadTransphormerAssessments(transphormerId: number) {
    this.transphormerId = transphormerId;
    this.trainerTransphormerService.transphormer(this.transphormerId)
      .then((transphormer: Transphormer) => {
        this.transphormer = transphormer;
      });
    this.advisorService.getTransphormerAssessments(transphormerId)
      .then((data: AssessmentData[]) => {
        if (data.length === 0) {
          return;
        }
        this.assessments = data.sort((a, b) => {
          return a.created > b.created ? -1 : 1;
        });
        this.assessmentIndex = 0;
        this.showAssessment(this.assessments[this.assessmentIndex]);
      });
  }

  public showAssessment(assessment: AssessmentData) {
    this.loadingAssessment = true;
    this.advisorService.getAdvisorAssessment(String(assessment.id))
      .then((data: Assessment) => {
        this.assessment = assessment;
        this.assessmentData = data;
        this.loadingAssessment = false;
      });
  }

  get assessmentStartDate() {
    return moment(this.assessment.week_start);
  }

  get assessmentEndDate() {
    return moment(this.assessment.week_end);
  }

  public get backHref() {
    return this.transphormerId ? `/details/${this.transphormerId}` : '/my-transphormers';
  }

  public previousAssessment() {
    this.assessmentIndex++;
    this.showAssessment(this.assessments[this.assessmentIndex]);
  }

  get hasPreviousAssessment() {
    return this.assessmentIndex + 1 !== this.assessments.length;
  }

  public nextAssessment() {
    this.assessmentIndex--;
    this.showAssessment(this.assessments[this.assessmentIndex]);
  }

  get hasNextAssessment() {
    return this.assessmentIndex !== 0;
  }

  public async sendMessage() {
    try {
      await this.messageService.sendMessage(
        this.transphormerId,
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
