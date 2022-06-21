import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { AssessmentQuestion } from './assessments';
import { Observable } from 'rxjs';
import { CameraPhotos } from '../camera/camera.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Weight } from '../weights/weights.service';
import { MacroCountingInfo } from '../nutrition/nutrition.service';
import { WorkoutSession } from '../workouts/workouts.service';
import { Transphormer } from '../authentication/authentication.service';

export interface Assessment {
  body_metrics: Weight[];
  responses: AssessmentResponses;
  photos: AssessmentPhotos;
  nutrition: MacroCountingInfo[];
  workouts: WorkoutSession[];
  transphormer: Transphormer;
}

export interface AssessmentResponses {
  version: number;
  report: AssessmentReport[];
}

export interface AssessmentReport {
  title: string;
  description: string;
  options: AssessmentReportOption[];
}

export interface AssessmentReportOption {
  title: string;
  value: number;
  icon: string;
  order: number;
}

export interface AssessmentPhotos {
  oldest: CameraPhotos;
  latest: CameraPhotos;
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    public localNotification: LocalNotifications
  ) {
    super(http, platform);
    AssessmentsService.SET_PLATFORM(platform);
  }

  /**
   * Returns list of questions against assessments
   */
  public assessmentQuestions(): Observable<{ version: number; questions: AssessmentQuestion[] }> {
    return this.http
      .get<{ version: number; questions: AssessmentQuestion[] }>(
        AssessmentsService.Url('assessment-questions'),
        AssessmentsService.BaseOptions(true, true));
  }

  /**
   * Save assessment in the backend
   *
   * @param assessmentQuestions
   * @param questionVersion
   * @param cameraPhoto
   */
  public saveAssessment(assessmentQuestions: AssessmentQuestion[], questionVersion: number, cameraPhoto: CameraPhotos): Observable<any> {

    const data = {
      response_data: {
        version: questionVersion,
        responses: assessmentQuestions.map(q => {
          return {
            id: q.id,
            value: q.options.find(o => o.is_selected).value
          };
        }),
      },
      update_id: cameraPhoto.id
    };

    return this.http.post(AssessmentsService.Url('assessment'), data, AssessmentsService.BaseOptions());
  }

  /**
   * Set local reminder to take notification in future date.
   * @param date
   */
  public reminderToTakeAssessment(date: Date) {
    if (this.platform.is('cordova')) {
      this.localNotification.schedule({
        id: 89,
        data: {page: '/take-assessment'},
        title: 'Reminder: Take your assessment',
        trigger: {
          at: date
        }
      });
    }
  }
}
