import { Component, Input } from '@angular/core';

@Component({
  selector: 'assessment-answers-list',
  templateUrl: './answers-list.component.html',
  styleUrls: ['./answers-list.component.scss'],
})
export class AnswersListComponent {

  private _responseReports: any[];

  @Input()
  public responseReports: any[] = [];

  /**
     * Returns the chosen option from the transphormer on the given response report
     * @param res the response report object
     */
  valueForResponse(res: any) {
    return res.options.find(x => x.value === res.value);
  }

}
