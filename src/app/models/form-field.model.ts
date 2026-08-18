export type FormFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'email'
  | 'date';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number | boolean;
  options?: SelectOption[];
  min?: number;
  max?: number;
  rows?: number;
}

export interface FormBuilderConfig {
  title: string;
  description?: string;
  submitLabel?: string;
  fields: FormFieldConfig[];
}

