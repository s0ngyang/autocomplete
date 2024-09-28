import React, { useState, useRef, useEffect } from "react";
import {
  useFloating,
  offset,
  flip,
  size,
  FloatingPortal,
  FloatingFocusManager,
  autoUpdate,
  useRole,
  useDismiss,
  useListNavigation,
  useInteractions,
} from "@floating-ui/react";
import { AutocompleteProps, Option } from "./types";
import { debounce } from "./helpers";

const Autocomplete: React.FC<AutocompleteProps<Option>> = ({
  label,
  loading,
  description,
  disabled = false,
  filterOptions,
  multiple,
  onChange,
  onInputChange,
  options,
  placeholder,
  renderOption,
  value,
  setValue,
  async,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav]
  );

  // debouce here?
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setActiveIndex(0);
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 300);

  const handleOptionClick = (option: Option) => {
    if (multiple) {
      if (!value) {
        onChange([option]);
      } else if (value.includes(option)) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
      if (typeof option === "string") {
        setInputValue(option);
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (multiple) {
      setValue([]);
    } else {
      setValue("");
    }
  }, []);

  useEffect(() => {
    if (onInputChange) {
      onInputChange(inputValue);
    }

    setFilteredOptions(filterOptions(options, inputValue));
  }, [inputValue, options, filterOptions, onInputChange]);

  return (
    <div className="relative">
      <p className="py-2">{label}</p>
      <input
        {...getReferenceProps({
          ref: refs.setReference,
          value: inputValue,
          onChange: handleInputChange,
          placeholder: placeholder,
          disabled: disabled,
          "aria-autocomplete": "list",
          className: "p-2 w-full focus:outline-orange-300 rounded-sm",
          onKeyDown(event) {
            if (
              event.key === "Enter" &&
              activeIndex != null &&
              filteredOptions[activeIndex]
            ) {
              handleOptionClick(filteredOptions[activeIndex]);
            }
          },
          onFocus() {
            setIsOpen(true);
          },
        })}
      />
      {loading && <div id="spinner" />}

      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                  background: "#eee",
                  color: "black",
                  overflowY: "auto",
                },
              })}
            >
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  {...getItemProps({
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      handleOptionClick(option);
                      refs.domReference.current?.focus();
                    },
                    className: `p-2 hover:bg-orange-400 flex items-center ${
                      activeIndex === index ? "bg-orange-400 text-white" : ""
                    }`,
                  })}
                >
                  {renderOption(option, multiple)}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
      <p className="py-2 text-sm">{description}</p>
    </div>
  );
};

export default Autocomplete;
