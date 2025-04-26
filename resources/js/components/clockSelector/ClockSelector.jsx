import { useState, useRef, useEffect } from "react";

export default function ClockSelector({ onClockChange, startClock }) {
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

  // Dışarı tıklanırsa menüyü kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-32 flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center px-2 rounded-md text-left bg-white cursor-pointer"
      >
        {startClock}
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-white mt-1 shadow-md rounded-md">
          {clocks.map((clock) => (
            <li
              key={clock}
              onClick={() => {
                onClockChange(clock);
                setIsOpen(false);
              }}
              className={`px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer border-b border-gray-300 ${
                clock === startClock ? "bg-blue-100" : ""
              }`}
            >
              {clock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
