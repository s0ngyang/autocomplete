interface AutocompleteProps<T> {
  label: string;
  description: string;
  disabled?: boolean;
  filterOptions?: (options: T[], query: string) => T[];
  loading?: boolean;
  multiple?: boolean;
  onChange: (value: T | T[]) => void;
  onInputChange?: (input: string) => void;
  options: T[];
  placeholder?: string;
  renderOption?: (option: T) => React.ReactNode;
  value: T | T[];
}

type Option = string | object;

export type { AutocompleteProps, Option };
