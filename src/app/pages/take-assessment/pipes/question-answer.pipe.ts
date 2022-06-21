import { Pipe, PipeTransform } from '@angular/core';
import { AssessmentQuestion } from '../../../services/assessments/assessments';

@Pipe({
  name: 'questionAnswer'
})
export class QuestionAnswerPipe implements PipeTransform {

  transform(question: AssessmentQuestion): string {
    const option = question.options.find(o => o.is_selected);

    if (!option) {
      return 'No answer selected';
    }

    return option.title;
  }

}
