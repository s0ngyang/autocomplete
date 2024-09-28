import React from "react";

interface AutocompleteProps<T> {
  label?: string;
  description?: string;
  disabled?: boolean;
  filterOptions: (options: T[], query: string) => T[];
  loading?: boolean;
  multiple: boolean;
  onChange: (value: T | T[]) => void;
  onInputChange?: (input: string) => void;
  options: T[];
  placeholder?: string;
  renderOption: (option: T, multiple: boolean) => React.ReactNode;
  value?: T | T[];
  setValue: React.Dispatch<React.SetStateAction<T | T[]>>;
  debounceValue?: number;
}

type Option = string | object;

export type { AutocompleteProps, Option };
