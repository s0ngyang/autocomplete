import "./App.css";
import Autocomplete from "./components/Autocomplete";
import { useState } from "react";
import { stringData, objectData } from "./components/data";
import { Option } from "./components/types";

function App() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Option | Option[]>();

  const handleChange = (value: Option | Option[]) => {
    setValue(value);
  };

  const filterOptions = (options: Option[], query: string) => {
    if (typeof options[0] === "string") {
      return options.filter((option) =>
        (option as string).toLowerCase().includes(query.toLowerCase())
      );
    } else if (typeof options[0] === "object") {
      // Check values of object
      return options.filter((option) =>
        Object.values(option).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    return options;
  };

  const renderOption = (option: Option, multiple: boolean) => {
    const isSelected =
      multiple && Array.isArray(value) && value.includes(option);
    return (
      <div className="px-1 hover:bg-orange-400 flex items-center">
        {multiple && (
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="mr-2"
          />
        )}
        <span>
          {typeof option === "string" ? (
            option
          ) : (
            <div className="flex flex-col">
              {Object.entries(option).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="p-2">
      <Autocomplete
        options={stringData}
        onChange={handleChange}
        value={value}
        multiple={false}
        filterOptions={filterOptions}
        renderOption={renderOption}
        label="Sync String Search (Single)"
        description="Search for fruits"
        placeholder="Search"
      />
      <Autocomplete
        loading={loading}
        options={objectData}
        onChange={handleChange}
        value={value}
        multiple
        filterOptions={filterOptions}
        renderOption={renderOption}
        label="Debounced Object Search (Multiple)"
        description="Search for fruit objects"
        placeholder="Search"
        debounceValue={300}
        setLoading={setLoading}
      />
    </div>
  );
}

export default App;
