'use client';
import { IoCheckmark } from 'react-icons/io5';
import Select, {
  StylesConfig,
} from 'react-select';
import { IDropdownProps } from '../utils/input';

export default function BasicDropdown({
  name,
  placeholder,
  options,
  isSearchable,
  onChange,
  value = null,
  useDefaultConfig = false,
}: IDropdownProps) {
  const customStyles: StylesConfig = {
    control: (base: any, state) => ({
      ...base,
      border: 0,
      outline: '1px solid #CCE0DF',
      color: '#00625F',
      fontSize: '14px',
      backgroundColor: 'white',
      padding: '4px 6px',
      borderRadius: '8px',
      boxShadow: 'none',
      width: '180px',
      whiteSpace: 'nowrap',
    }),
    option: (base: any, state) => ({
      ...base,
      fontSize: '12px',
      whiteSpace: 'nowrap'
    }),
    menu: (base: any, state) => ({
      ...base,
      position: 'absolute',
      whiteSpace: 'nowrap'
    }),
    singleValue: (base: any, state) => ({
      ...base,
      color: '#00625F',
      fontSize: '14px',
      fontWeight: '500',
    }),
    placeholder: (base: any, state) => ({
      ...base,
      color: '#00625F',
      fontSize: '14px',
      fontWeight: '500',
    }),
  };

  if (options && !useDefaultConfig) {
    value = options.find((option) => value == option?.value) || null;
  }

  const DropdownOption = ({ data, isSelected, innerProps }: { data: any; isSelected: boolean; innerProps: any }) => {
    return (
      <div
        {...innerProps}
        className={`text-[#6e6e6e] flex items-center hover:bg-[#80808023] p-1 cursor-pointer gap-2 font-medium mt-[0.4em]  mx-3 ${isSelected ? 'bg-gray-200' : ''}`}
      >
        {data.icon}
        <div>
          {data.label}
        </div>
      </div>
    );
  };

  const SingleValue = ({ data }: { data: any }) => {
    return (
      <div className="flex gap-2 items-center mt-[-2.2em]">
        {data.icon}
        <div>{data.label}</div>
      </div>
    );
  };
  

  return (
    <Select
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      onChange={onChange}
      autoFocus
      components={{
        Option: DropdownOption,
        SingleValue: SingleValue
      }}
      value={value}
      styles={customStyles}
    />
  );
}
