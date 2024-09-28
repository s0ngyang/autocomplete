import React, { useState, useRef, useCallback } from "react";
import {
  useFloating,
  offset,
  size,
  FloatingPortal,
  FloatingFocusManager,
  autoUpdate,
  useDismiss,
  useListNavigation,
  useInteractions,
  useFocus,
} from "@floating-ui/react";
import { AutocompleteProps, Option } from "./types";
import { debounce } from "./helpers";

const Autocomplete: React.FC<AutocompleteProps<Option>> = ({
  label,
  loading = false,
  description,
  disabled = false,
  filterOptions,
  multiple,
  onChange,
  options,
  placeholder,
  renderOption,
  value,
  debounceValue = 0,
  setLoading,
}) => {
  const [inputValue, setInputValue] = useState(multiple ? [] : "");
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

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [dismiss, listNav, focus]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setActiveIndex(0);
    if (setLoading) {
      setLoading(true);
    }
    debouncedFilterOptions(newValue);
  };

  const debouncedFilterOptions = useCallback(
    debounce((value: string) => {
      setFilteredOptions(filterOptions(options, value));
      if (setLoading) {
        setLoading(false);
      }
    }, debounceValue),
    [options, filterOptions]
  );

  const handleOptionClick = (option: Option) => {
    if (multiple) {
      if (!value) {
        onChange([option]);
      } else if ((value as Option[]).includes(option)) {
        onChange((value as Option[]).filter((v) => v !== option));
      } else {
        onChange([...(value as Option[]), option]);
      }
    } else {
      onChange(option);
      if (typeof option === "string") {
        setInputValue(option);
      }
    }
  };

  return (
    <div className="relative">
      <p className="py-2">{label}</p>
      <div>
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
          })}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className="w-5 h-5 border-2 border-t-transparent border-orange-400 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
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
