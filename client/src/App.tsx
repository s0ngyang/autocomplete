import "./App.css";
import Autocomplete from "./components/Autocomplete";
import { useState } from "react";
import { data } from "./components/data";

function App() {
  // for debounce
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | object>("");

  const handleChange = (value: string | object) => {
    setSelectedValue(value);
    console.log("Selected value:", value);
  };

  const handleInputChange = (input: string) => {
    console.log("Input changed:", input);
  };

  return (
    <div className="App">
      <Autocomplete
        label="Sync Search"
        description="Start typing to search"
        placeholder="Search"
        loading={loading}
        options={data}
        onChange={handleChange}
        onInputChange={handleInputChange}
        value={selectedValue}
        multiple={true} // Toggle this to test single vs. multiple selection
      />
    </div>
  );
}

export default App;
