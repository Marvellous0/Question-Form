export default interface TObject {
  questionName: string;
  questionDescription: string;
  isRequired: boolean;
  type: 'text' | 'multiple' | 'linear' | 'file' | 'checkboxes';
  linearScale?: {
    max?: {
      value: number;
      label: string;
    };
    min?: {
      value: number;
      label: string;
    };
  };
  options?: string[];
}