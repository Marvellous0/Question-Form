import { render, fireEvent } from '@testing-library/react';
import PreviewPage from '../../components/preview';
import '@testing-library/jest-dom';

type LinearScale = {
  min: { value: number; label: string };
  max: { value: number; label: string };
};

type TObject = {
  questionDescription: string;
  type: 'text' | 'multiple' | 'checkboxes' | 'linear' | 'file';
  questionName: string;
  isRequired: boolean;
  options?: string[];
  linearScale?: LinearScale;
};

const questions: TObject[] = [
  {
    questionDescription: 'Question 1',
    type: 'text',
    questionName: 'q1',
    isRequired: true,
  },
  {
    questionDescription: 'Question 2',
    type: 'multiple',
    questionName: 'q2',
    isRequired: true,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    questionDescription: 'Question 3',
    type: 'checkboxes',
    questionName: 'q3',
    isRequired: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    questionDescription: 'Question 4',
    type: 'linear',
    questionName: 'q4',
    isRequired: false,
    linearScale: {
      min: { value: 1, label: '1' },
      max: { value: 5, label: '5' },
    },
  },
];

describe('PreviewPage', () => {
  it('renders correctly', () => {
    const { container } = render(<PreviewPage questions={questions} file={null} />);
    expect(container).toMatchSnapshot();
  });

  it('handles next question', () => {
    const { getByText } = render(<PreviewPage questions={questions} file={null} />);
    fireEvent.click(getByText('Next'));
    expect(getByText('Question 2')).toBeInTheDocument();
  });

  it('handles previous question', () => {
    const { getByText } = render(<PreviewPage questions={questions} file={null} />);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Previous'));
    expect(getByText('Question 1')).toBeInTheDocument();
  });

  it('handles text input', () => {
    const { getByPlaceholderText } = render(<PreviewPage questions={questions} file={null} />);
    const input = getByPlaceholderText('Your answer');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input).toHaveValue('Hello World');
  });

  it('handles multiple choice input', () => {
    const { getByLabelText, getByText } = render(<PreviewPage questions={questions} file={null} />);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByLabelText('Option 1'));
    expect(getByLabelText('Option 1')).toBeChecked();
  });

  it('handles checkboxes input', () => {
    const { getByLabelText, getByText } = render(<PreviewPage questions={questions} file={null} />);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByLabelText('Option 1'));
    expect(getByLabelText('Option 1')).toBeChecked();
  });

  it('handles linear scale input', () => {
    const { getByLabelText, getByText } = render(<PreviewPage questions={questions} file={null} />);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByLabelText('3'));
    expect(getByLabelText('3')).toBeChecked();
  });
});
