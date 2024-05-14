import TObject from '../utils/question';
import { useState, Dispatch, SetStateAction } from 'react';
import { FaTrashCan } from "react-icons/fa6";
import BasicDropdown from './dropdown';
import { IInputOptions } from '../utils/input';
import { LiaTimesSolid } from "react-icons/lia";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { RiRadioButtonLine } from "react-icons/ri";
import { MdLinearScale } from "react-icons/md";
import { GrCheckboxSelected } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';

interface QuestionProps {
    question: TObject & { imageUrl?: string };
    onDelete: () => void;
    onUpdate: (question: TObject & { imageUrl?: string }) => void;
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, onDelete, onUpdate, file, setFile }) => {
    const [selectedType, setSelectedType] = useState({
        label: "Short answer",
        value: "text"
    });

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [minLabel, setMinLabel] = useState<string>('Min');
    const [maxLabel, setMaxLabel] = useState<string>('Max');

    const [filters, setFilters] = useState({
        status: null,
    });
    const [isRequired, setIsRequired] = useState<boolean>(question.isRequired);
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(2);
    const minValueOptions: IInputOptions[] = [
        { label: '0', value: '0' },
        { label: '1', value: '1' }
    ];

    const maxValueOptions: IInputOptions[] = [...Array(9)].map((_, i) => ({
        label: `${i + 2}`,
        value: `${i + 2}`
    }));

    const [statusOptions] = useState<IInputOptions[]>([
        { label: 'Short answer', value: 'text', icon: <BiMenuAltLeft /> },
        { label: 'Multiple choices', value: 'multiple', icon: <RiRadioButtonLine /> },
        { label: 'Linear scale', value: 'linear', icon: <MdLinearScale /> },
        { label: 'Checkboxes', value: 'checkboxes', icon: <GrCheckboxSelected /> },
        { label: 'File upload', value: 'file', icon: <FaCloudUploadAlt /> },
    ]);

    const handleTypeChange = (event: any) => {
        setFilters({ ...filters, status: event });
        setSelectedType(event);
        if (event.value === 'linear') {
            onUpdate({ ...question, type: event.value, linearScale: { max: { value: maxValue, label: 'Max' }, min: { value: minValue, label: 'Min' } } });
        }
        else if (event.value === 'multiple' || event.value === 'checkboxes') {
            onUpdate({ ...question, type: event.value, questionName: event.label, options: [] });
        }
        else {
            onUpdate({ ...question, type: event.value, questionName: event.label });
        }
    };

    const preset_key = "jivcoy6i";
    const cloud_name = "dxkgfx2wa";

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (!uploadedFile) return;

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('upload_preset', preset_key);

            axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)
                .then(res => setFile(res.data.secure_url))
                .catch(err => console.log(err));

        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
        }
    };

    const handleAddOption = () => {
        const newOption = `Option ${question.options!.length + 1}`;
        const newOptions = [...question.options!, newOption];
        onUpdate({ ...question, options: newOptions });
        setSelectedOptions((prevOptions) => [...prevOptions, newOption]);
    };

    const handleOptionChange = (option: any, index?: number) => {
        if (index !== undefined) {
            const newOptions = [...question.options!];
            newOptions[index] = option;
            onUpdate({ ...question, options: newOptions });
        }
        else {
            setSelectedOptions((prevOptions) => [...prevOptions, option]);
            onUpdate({ ...question });
        }
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...question.options!];
        newOptions.splice(index, 1);
        onUpdate({ ...question, options: newOptions });
    };

    const handleMinValueChange = (event: any) => {
        const selectedValue = parseInt(event.value);
        onUpdate({
            ...question,
            linearScale: {
                ...question.linearScale,
                min: {
                    value: selectedValue,
                    label: question.linearScale?.min?.label! || 'Min',
                }
            }
        });
    };

    const handleMaxValueChange = (event: any) => {
        const selectedValue = parseInt(event.value);
        setMaxValue(selectedValue);
        onUpdate({
            ...question,
            linearScale: {
                ...question.linearScale,
                max: {
                    value: selectedValue,
                    label: question.linearScale?.max?.label! || 'Max',
                }
            }
        });
    };


    const handleToggleRequired = () => {
        const updatedQuestion = { ...question, isRequired: !isRequired };
        setIsRequired(!isRequired);
        onUpdate(updatedQuestion);
    };

    return (
        <div className="bg-white flex flex-col rounded shadow-md p-6 m-9 ">
            <h2 className="text-lg font-bold">{question.questionName}</h2>
            <div className='flex justify-between'>
                <div className="mb-4 outline-none">
                    <input
                        type="text"
                        placeholder='Question'
                        value={question.questionDescription || ''}
                        onChange={(e) => onUpdate({ ...question, questionDescription: e.target.value })}
                        className="w-[500px] p-2 pl-5 text-sm text-[#a6a0a6] bg-[#f8f9fa] outline-none border-b-[1px] border-[#80868b] focus:border-[#a26000]"
                    />
                </div>
                <BasicDropdown
                    name="Status"
                    placeholder={selectedType?.label}
                    options={statusOptions}
                    value={selectedType?.value}
                    onChange={handleTypeChange}
                />
            </div>

            {selectedType?.value === 'text' ? (
                <input
                    type="text"
                    value='Short text here'
                    onChange={(e) => onUpdate({ ...question, questionDescription: e.target.value })}
                    className="block w-[40%] bg-white p-2 pl-5 text-sm text-gray-700 outline-none border-b-[1px] border-dashed"
                    placeholder='Short answer text'
                    disabled
                />
            ) :
                selectedType?.value === 'multiple' ? (
                    <div className="mb-4">
                        {question.options?.map((option, index) => (
                            <label key={`${option}-${index}`} className="block mb-2">
                                <input
                                    type="radio"
                                    name={`a-${index}`} // Use a unique name for each group
                                    value={option}
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(e.target.value, index)}
                                    // onClick={(e) => e.stopPropagation()}
                                    className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                                />
                                <button
                                    onClick={() => handleRemoveOption(index)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <LiaTimesSolid size={15} />
                                </button>
                            </label>
                        ))}
                        {question?.options?.length == 0 && <label className="block mb-2">
                            <input
                                type="radio"
                                name={`option-${0}`} // Use a unique name for each group
                                value={''}
                                className="mr-2"
                            />
                            <input
                                type="text"
                                value={''}
                                onChange={(e) => handleOptionChange(e.target.value, 0)}
                                className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                                placeholder='Option 1'
                            />
                        </label>}
                        <input
                            type="text"
                            value={''}
                            onChange={handleAddOption}
                            className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                            placeholder='Add Other option'
                        />
                    </div>
                )

                    : selectedType?.value === 'linear' ? (
                        <>
                            <div className="mb-4 flex items-center justify-between w-[20%]">
                                <BasicDropdown
                                    name="Min Value"
                                    placeholder="Select Min Value"
                                    options={minValueOptions}
                                    value={minValue}
                                    onChange={handleMinValueChange}
                                />
                                <span>to</span>
                                <BasicDropdown
                                    name="Max Value"
                                    placeholder="Select Max Value"
                                    options={maxValueOptions}
                                    value={maxValue}
                                    onChange={handleMaxValueChange}
                                />
                            </div>
                            <div className='flex flex-col p-2 gap-6'>
                                <div className='flex gap-5'>
                                    <span>{minValue}</span>
                                    <input
                                        type="text"
                                        value={''}
                                        placeholder="Label (optional)"
                                        className="mr-2 outline-none w-[40%] border-b-[1px] border-[#80868b]"
                                    />
                                </div>

                                <div className='flex gap-5'>
                                    <span>{maxValue}</span>
                                    <input
                                        type="text"
                                        value={''}
                                        placeholder="Label (optional)"
                                        className="mr-2 outline-none w-[40%] border-b-[1px] border-[#80868b]"
                                    />
                                </div>
                            </div>
                        </>
                    ) :
                        selectedType?.value === 'checkboxes' ? (
                            <div className="mb-4">
                                {question.options?.map((option, index) => (
                                    <label key={`option-${index}`} className="block mb-2">
                                        <input
                                            type="checkbox"
                                            name={`option-${index}`} // Use a unique name for each group
                                            value={option}
                                            className="mr-2"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(e.target.value, index)}
                                            // onClick={(e) => e.stopPropagation()}
                                            className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                                        />
                                        <button
                                            onClick={() => handleRemoveOption(index)}
                                            className="text-gray-500 hover:text-gray-800"
                                        >
                                            <LiaTimesSolid size={15} />
                                        </button>
                                    </label>
                                ))}
                                {question?.options?.length == 0 && <label className="block mb-2">
                                    <input
                                        type="checkbox"
                                        name={`option-${0}`} // Use a unique name for each group
                                        value={''}
                                        className="mr-2"
                                    />
                                    <input
                                        type="text"
                                        value={''}
                                        onChange={(e) => handleOptionChange(e.target.value, 0)}
                                        className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                                        placeholder='Option 1'
                                    />
                                </label>}
                                <input
                                    type="text"
                                    value={''}
                                    onChange={handleAddOption}
                                    className="mr-2 outline-none w-[80%] hover:border-b-[1px] border-[#80868b] p-2"
                                    placeholder='Add Other option'
                                />
                            </div>
                        )
                            : selectedType?.value === 'file' ? (
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="block w-full p-2 pl-10 text-sm text-gray-700"
                                />
                            ) : null}

            <div className='flex justify-end gap-5'>
                <button onClick={handleToggleRequired} className='flex gap-2'>
                    <span className='text-[#c5c3c6]'>Required</span>
                    {isRequired ? <FaToggleOn size={25} color="#a26000" /> : <FaToggleOff size={25} />}
                </button>
                <button
                    onClick={onDelete}
                    className="text-gray-500 hover:text-gray-800"
                >
                    <FaTrashCan size={25} />
                </button>
            </div>
        </div>
    );
};

export default QuestionComponent;