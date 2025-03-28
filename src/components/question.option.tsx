import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const QuestionOptions = ({ selectedType, question, onUpdate }: { selectedType: any, question: any, onUpdate: any }) => {
    const [optionInputs, setOptionInputs] = useState<string[]>(question.options || []);

    // Handle input changes for both radio and checkbox
    const handleOptionChange = (value: string, index: number) => {
        const newOptions = [...optionInputs];
        newOptions[index] = value;
        setOptionInputs(newOptions);
        onUpdate({ ...question, options: newOptions });
    };

    const addOption = () => {
        setOptionInputs([...optionInputs, ""]); 
    };

    // Remove an option
    const removeOption = (index: number) => {
        const newOptions = optionInputs.filter((_, i) => i !== index);
        setOptionInputs(newOptions);
        onUpdate({ ...question, options: newOptions });
    };

    return (
        <div>
            {optionInputs.map((option, index) => (
                <label key={index} className="block mb-2 flex items-center">
                    <input
                        type={selectedType?.value === "multiple" ? "radio" : "checkbox"}
                        name="options"
                        value={option}
                        className="mr-2"
                    />
                    <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(e.target.value, index)}
                        className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                        placeholder="Enter option"
                    />
                    <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        <RxCross2 color="red" size={20} />
                    </button>
                </label>
            ))}


            <button
                type="button"
                onClick={addOption}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                <div className="flex items-center gap-2">
                    <IoMdAdd color="purple" size={20} /> Add Option
                </div>
            </button>
        </div>
    );
};

export default QuestionOptions;
