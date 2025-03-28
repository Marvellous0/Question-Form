import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionComponent from '../../components/question.component';
import TObject from '../../utils/question';

describe('QuestionComponent', () => {
    it('renders question name and description correctly', () => {
        const question: TObject = {
            questionName: 'Test Question',
            questionDescription: 'This is a test question',
            type: 'text',
            isRequired: false,
            linearScale: {
                min: { value: 0, label: 'Min' },
                max: { value: 2, label: 'Max' },
            },
            options: [],
        }

        render(<QuestionComponent question={question} file={null} onDelete={() => { }} onUpdate={() => { }} setFile={() => { }} />);

        expect(screen.getByText('Test Question')).toBeInTheDocument();
        expect(screen.getByDisplayValue('This is a test question')).toBeInTheDocument();
    });

    it('updates question description on input change', () => {
        const question: TObject = {
            questionName: 'Test Question',
            questionDescription: 'Initial description',
            type: 'text',
            isRequired: false,
            linearScale: {
                min: { value: 0, label: 'Min' },
                max: { value: 2, label: 'Max' },
            },
            options: [],
        };

        const mockOnUpdate = () => { };

        render(<QuestionComponent 
            question={question} 
            file={null} 
            onDelete={() => { }} 
            onUpdate={mockOnUpdate} 
            setFile={() => { }} 
        />);

        const input = screen.getByPlaceholderText('Question');
        fireEvent.change(input, { target: { value: 'Updated description' } });

        expect(input).toHaveValue('Updated description');
    });
});
