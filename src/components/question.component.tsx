import TObject from '../utils/question';
import { useState, Dispatch, SetStateAction } from 'react';
import { FaTrashCan } from "react-icons/fa6";
import BasicDropdown from './dropdown';
import { IInputOptions } from '../utils/input';
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { RiRadioButtonLine } from "react-icons/ri";
import { MdLinearScale } from "react-icons/md";
import { GrCheckboxSelected } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import QuestionOptions from './question.option';

interface QuestionProps {
    question: TObject;
    onDelete: () => void;
    onUpdate: (question: TObject) => void;
    file: string | null;
    setFile: Dispatch<SetStateAction<string | null>>;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, onDelete, onUpdate, setFile }) => {
    const [description, setDescription] = useState<string>(question.questionDescription || '');

    const [selectedType, setSelectedType] = useState({
        label: "Short answer",
        value: "text"
    });
    const [filters, setFilters] = useState({
        status: null,
    });
    const [isRequired, setIsRequired] = useState<boolean>(question.isRequired);
    const [minValue, setMinValue] = useState<number>(question.linearScale?.min?.value || 0);
    const [maxValue, setMaxValue] = useState<number>(question.linearScale?.max?.value || 2);
    const [minLabel, setMinLabel] = useState<string>(question.linearScale?.min?.label || '');
    const [maxLabel, setMaxLabel] = useState<string>(question.linearScale?.max?.label || '');
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

    const handleMinValueChange = (event: any) => {
        const selectedValue = parseInt(event.value);
        setMinValue(selectedValue);
        onUpdate({
            ...question,
            linearScale: {
                ...question.linearScale,
                min: { value: selectedValue, label: minLabel }
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
                max: { value: selectedValue, label: maxLabel }
            }
        });
    };

    const handleMinLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const label = event.target.value;
        setMinLabel(label);
        onUpdate({
            ...question,
            linearScale: {
                ...question.linearScale,
                min: { value: minValue, label }
            }
        });
    };

    const handleMaxLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const label = event.target.value;
        setMaxLabel(label);
        onUpdate({
            ...question,
            linearScale: {
                ...question.linearScale,
                max: { value: maxValue, label }
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
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value); 
                            onUpdate({ ...question, questionDescription: e.target.value }); 
                        }}
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
                (selectedType?.value === 'multiple' || selectedType?.value === 'checkboxes') ? (
                    <QuestionOptions selectedType={selectedType} question={question} onUpdate={onUpdate} />
                )
                    :
                    selectedType?.value === 'linear' ? (
                        <>
                            <div className="mb-4 flex items-center justify-between w-[40%]">
                                <BasicDropdown
                                    name="Min Value"
                                    placeholder="Select Min Value"
                                    options={minValueOptions}
                                    value={minValue.toString()}
                                    onChange={handleMinValueChange}
                                />
                                <span>to</span>
                                <BasicDropdown
                                    name="Max Value"
                                    placeholder="Select Max Value"
                                    options={maxValueOptions}
                                    value={maxValue.toString()}
                                    onChange={handleMaxValueChange}
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex gap-5 items-center">
                                    <span>{minValue}</span>
                                    <input
                                        type="text"
                                        value={minLabel}
                                        onChange={handleMinLabelChange}
                                        placeholder="Label (optional)"
                                        className="w-[40%] border-b-[1px] border-gray-400 outline-none p-2"
                                    />
                                </div>

                                <div className="flex gap-5 items-center">
                                    <span>{maxValue}</span>
                                    <input
                                        type="text"
                                        value={maxLabel}
                                        onChange={handleMaxLabelChange}
                                        placeholder="Label (optional)"
                                        className="w-[40%] border-b-[1px] border-gray-400 outline-none p-2"
                                    />
                                </div>
                            </div>
                        </>
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