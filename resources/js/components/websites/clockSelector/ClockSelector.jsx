import { useState, useRef, useEffect } from "react";

export default function ClockSelector({ onClockChange, selectedClock }) {
  const clocks = [
    "00.00", "00.30", "01.00", "01.30", "02.00", "02.30", "03.00", "03.30",
    "04.00", "04.30", "05.00", "05.30", "06.00", "06.30", "07.00", "07.30",
    "08.00", "08.30", "09.00", "09.30", "10.00", "10.30", "11.00", "11.30",
    "12.00", "12.30", "13.00", "13.30", "14.00", "14.30", "15.00", "15.30",
    "16.00", "16.30", "17.00", "17.30", "18.00", "18.30", "19.00", "19.30",
    "20.00", "20.30", "21.00", "21.30", "22.00", "22.30", "23.00", "23.30"
  ];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
  if (isOpen && listRef.current) {
    setTimeout(() => {
      const index = clocks.indexOf(selectedClock);
      if (index > -1) {
        const element = listRef.current?.children[index];
        if (element) {
          element.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      } else {
        const firstElement = listRef.current?.children[10*2];
        if (firstElement) {
          firstElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 0);
  }
}, [isOpen, selectedClock]);

  return (
    <div ref={dropdownRef} className="max-h-48 w-full flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault(); 
          setIsOpen(!isOpen);
        }}
        className="relative h-12 z-10 w-full flex items-center justify-center px-2 rounded-md text-left cursor-pointer"
      >
        <span className="block truncate">{selectedClock || "00.00"}</span>
{/*         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg> */}
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-20 max-h-48 overflow-y-auto bg-white mt-1 shadow-md rounded-md"
          ref={listRef}
          >
          {clocks.map((clock) => (
            <li
              key={clock}
              onClick={() => {
                onClockChange(clock);
                setIsOpen(false);
              }}
              className={`px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer border-b border-gray-300 ${
                clock === selectedClock ? "bg-blue-100" : ""
              }`}

            >
              <span className="block truncate">{clock}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}