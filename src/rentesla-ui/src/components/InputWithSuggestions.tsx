import { useState, useEffect, useMemo } from "react";
import { LocationDto } from "../types/ApiResults";

type InputWithSuggetionsProps = {
  label: string;
  value: string;
  onChange: (name: string) => void;
  suggestions: LocationDto[];
}

const InputWithSuggestions: React.FC<InputWithSuggetionsProps> = ({
  label, 
  value, 
  onChange, 
  suggestions
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputText, setInputText] = useState(value);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(loc =>
      loc.name.toLowerCase().includes(inputText.toLowerCase())
    );
  }, [inputText, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    setInputText(name);
    onChange(name);
    setShowSuggestions(false);
  };

  useEffect(() => {
    setInputText(value);
  }, [value]);
  
    return (
      <div className="relative flex flex-col">
        <label className="text-sm font-medium mb-1">{label}</label>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="p-2 rounded-md border border-gray-300"
          placeholder="Start typing a location..."
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white z-10 max-h-40 overflow-auto border border-gray-300 rounded shadow-md">
            {filteredSuggestions.map(loc => (
              <li
                key={loc.name}
                className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(loc.name)}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export { InputWithSuggestions };