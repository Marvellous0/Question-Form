import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuestionOptions from "../../components/question.option";

describe("QuestionOptions Component", () => {
    let mockUpdate: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockUpdate = vi.fn();
    });

    it("renders options correctly", () => {
        const question = { options: ["Option 1", "Option 2"] };

        render(<QuestionOptions selectedType={{ value: "multiple" }} question={question} onUpdate={mockUpdate} />);

        // Ensure both input fields are present
        const inputs = screen.getAllByPlaceholderText("Enter option");
        expect(inputs.length).toBe(2); 
    });

    it("adds a new option", () => {
        const question = { options: ["Option 1"] };

        render(<QuestionOptions selectedType={{ value: "multiple" }} question={question} onUpdate={mockUpdate} />);

        const addButton = screen.getByText("Add Option");
        fireEvent.click(addButton);

        const inputs = screen.getAllByPlaceholderText("Enter option");
        expect(inputs.length).toBe(2); 
    });

    it("removes an option", () => {
        const question = { options: ["Option 1", "Option 2"] };

        render(<QuestionOptions selectedType={{ value: "multiple" }} question={question} onUpdate={mockUpdate} />);

        const removeButtons = screen.getAllByRole("button");
        fireEvent.click(removeButtons[0]); 

        expect(mockUpdate).toHaveBeenCalledWith({ ...question, options: ["Option 2"] });
    });

    it("updates an option value", () => {
        const question = { options: ["Option 1", "Option 2"] };

        render(<QuestionOptions selectedType={{ value: "multiple" }} question={question} onUpdate={mockUpdate} />);

        const inputs = screen.getAllByPlaceholderText("Enter option");
        fireEvent.change(inputs[0], { target: { value: "Updated Option" } });

        expect(mockUpdate).toHaveBeenCalledWith({ ...question, options: ["Updated Option", "Option 2"] });
    });
});
