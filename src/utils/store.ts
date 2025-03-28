import create from 'zustand';
import TObject from './question';

interface Store {
  questions: TObject[];
  addQuestion: (question: TObject) => void;
  deleteQuestion: (index: number) => void;
  updateQuestion: (index: number, question: TObject) => void;
  previewQuestions: () => TObject[];
}

const useStore = create<Store>((set, get) => ({
  questions: [
    {
      questionName: '',
      questionDescription: '',
      isRequired: false,
      type: 'text',
    },
  ],
  addQuestion: (question: TObject) => {
    set((state) => ({ questions: [...state.questions, question] }));
  },
  deleteQuestion: (index: number) => {
    set((state) => ({ questions: state.questions.filter((_, i) => i !== index) }));
  },
  updateQuestion: (index: number, question: TObject) => {
    set((state) => ({ questions: state.questions.map((prevQuestion, i) => (i === index ? question : prevQuestion)) }));
  },
  previewQuestions: () => get().questions,
}));

export default useStore;
