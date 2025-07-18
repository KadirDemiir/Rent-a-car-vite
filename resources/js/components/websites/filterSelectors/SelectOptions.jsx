    import { useState } from "react";
    import useClickOutside from "../../useClickOutside.jsx"

    export default function SelectedOptions({ value = [], onChange, options = [], options_name, multiple= false}) {
      const [open, setOpen] = useState(false);
        const wrapperRef = useClickOutside(() => setOpen(false));

      const isAllOption = (val) => val === "";

      const toggleSelection = (selectedValue) => {
          if(!multiple) {
              onChange(selectedValue);
              setOpen(false);
              return
          }
        if (isAllOption(selectedValue)) {
          onChange([""]);
        } else {
          let newValue = [...value].filter((v) => v !== "");

          if (newValue.includes(selectedValue)) {
            newValue = newValue.filter((val) => val !== selectedValue);
            if(! newValue.length > 0 )
              newValue = [""];
          } else {
            newValue.push(selectedValue);
            console.log(newValue, newValue.length === 3);
          }
            if(newValue.length === options.length-1)
                onChange([""]);
            else
                onChange(newValue);
        }
      };

      const getSelectedLabels = () => {
        if (value.length === 0 || (value.length === 1 && value[0] === ""))
          return options[0].label;
          const selectedOptions = options.filter(opt =>
              JSON.stringify(value).includes(JSON.stringify(opt.value))
          );
          return selectedOptions.map((opt) => opt.label).join(", ");
      };

      const isSelected = (val) => JSON.stringify(value).includes(JSON.stringify(val));

      return (
        <div ref={wrapperRef} className="flex flex-col w-full relative">
          <label className="mb-1 text-sm font-semibold text-gray-700 text-center">{options_name}</label>

          <button type="button" onClick={() => setOpen(!open)}  className="px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm flex justify-between items-center"
          >
            <span className="truncate">{getSelectedLabels()}</span>
            <svg className="w-4 h-4 ml-2 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-80 overflow-auto">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                    isSelected(opt.value) ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => toggleSelection(opt.value)}
                >
                  {opt.label}
                  {isSelected(opt.value) && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
