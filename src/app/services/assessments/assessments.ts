export interface Assessment {
  id: number;
}

export interface AssessmentQuestion {
  id: string | number;
  description: string;
  title: string;
  order: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  title: string;
  value: number;
  icon: string;
  order: number;
  is_selected?: boolean;
}
