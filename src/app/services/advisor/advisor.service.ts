import { ErrorFormat } from './../errors/errors.service';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Injectable } from '@angular/core';
import { Transphormer } from '../authentication/authentication.service';
import { Moment } from 'moment';

export interface AssessmentResponse {
  current_page: number;
  data: AssessmentData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface AssessmentData {
  id: number;
  transphormer_id: number;
  week_start: string;
  week_end: string;
  response_data: any[];
  update_id: number;
  reviewed: number;
  created_at: string;
  created?: Date;
  updated_at: string;
  updated?: Date;
  transphormer: Transphormer;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisorService extends BaseService {

  constructor(protected http: HttpClient, protected platform: Platform) {
    super(http, platform);
    AdvisorService.SET_PLATFORM(platform);
  }

  public getTransphormerAssessments(transphormerId: number): Promise<AssessmentData[] | ErrorFormat> {
    return this.http.get<AssessmentData[]>(AdvisorService.Url(`trainer/transphormer/${transphormerId}/assessments`), AdvisorService.BaseOptions())
      .toPromise()
      .then((response) => {
        response.map((item) => {
          item.created = new Date(item.created_at);
          item.updated = new Date(item.updated_at);
          return item;
        });
        return response;
      })
      .catch(AdvisorService.HandleError);

  }

  /**
   *
   */
  public getAdvisorAssessments(pPage?: number, since?: Moment): Promise<AssessmentResponse | ErrorFormat> {

    const page = pPage || 1;
    const url = `trainer/assessments?page=${page}` + (since ? `&since=${since.toISOString()}` : '');
    return this.http.get<AssessmentResponse>(AdvisorService.Url(url), AdvisorService.BaseOptions())
      .toPromise()
      .then((response) => {
        response.data.map((item) => {
          item.created = new Date(item.created_at);
          item.updated = new Date(item.updated_at);
          return item;
        });
        return response;
      })
      .catch(AdvisorService.HandleError);

  }

  /**
   *
   * @param id
   */
  public getAdvisorAssessment(id: string): Promise<any> {

    return this.http.get<any>(
      AdvisorService.Url('trainer/assessment/' + id), AdvisorService.BaseOptions())
      .toPromise()
      .catch(AdvisorService.HandleError);

  }

  /**
   *
   * @param id
   */
  public markAssessmentAsReviewed(id: string): Promise<any> {

    return this.http.post<any>(
      AdvisorService.Url('trainer/assessment/' + id + '/review'),
      null,
      AdvisorService.BaseOptions())
      .toPromise()
      .catch(AdvisorService.HandleError);

  }

}
