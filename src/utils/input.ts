export interface IInputOptions {
    label?: string;
    value?: string;
    disabled?: boolean;
    icon?: React.JSX.Element;
  }

export interface IDropdownProps {
    name: string;
    placeholder: string;
    options: IInputOptions[];
    isSearchable?: boolean;
    value?: any;
    defaultValue?: any;
    useDefaultConfig?: boolean;
    showIcons?: boolean;
    onChange?: (e: any) => void;
  }