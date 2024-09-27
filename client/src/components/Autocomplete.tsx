import React, { useState, useEffect } from "react";
import {
  useFloating,
  shift,
  offset,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { AutocompleteProps, Option } from "./types";

const Autocomplete: React.FC<AutocompleteProps<Option>> = ({
  label,
  description,
  disabled = false,
  filterOptions,
  loading = true,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder = "Search",
  renderOption,
  value,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, reference, floating, context } = useFloating({
    middleware: [offset(5), shift()],
    placement: "bottom-start",
  });

  useEffect(() => {
    if (onInputChange) {
      onInputChange(inputValue);
    }

    if (filterOptions) {
      setFilteredOptions(filterOptions(options, inputValue));
    } else {
      // Default filtering logic for string options
      if (typeof options[0] === "string") {
        setFilteredOptions(
          options.filter((option) =>
            (option as string).toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      } else {
        // Implement custom filtering logic for object options if necessary
        setFilteredOptions(options);
      }
    }
  }, [inputValue, options, filterOptions, onInputChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: Option) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
    setInputValue(""); // Clear input after selection
  };

  const renderDefaultOption = (option: Option) => {
    if (typeof option === "string") {
      return <div className="p-2 hover:bg-gray-200">{option}</div>;
    } else {
      // Customize based on object structure
      return (
        <div className="p-2 hover:bg-gray-200">{JSON.stringify(option)}</div>
      );
    }
  };

  return (
    <div className="relative">
      <p className="py-2">{label}</p>
      <input
        className="p-2 w-full focus:outline-orange-300 rounded-sm"
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      {loading && <div id="spinner" />}
      {isOpen && (
        <FloatingFocusManager context={context}>
          <FloatingPortal>
            {filteredOptions.map((option, index) => (
              <div key={index} onClick={() => handleOptionClick(option)}>
                {renderOption
                  ? renderOption(option)
                  : renderDefaultOption(option)}
              </div>
            ))}
          </FloatingPortal>
        </FloatingFocusManager>
      )}
      <p className="py-2">{description}</p>
    </div>
  );
};

export default Autocomplete;
