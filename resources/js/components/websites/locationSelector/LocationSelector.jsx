import { useEffect, useRef, useState } from "react";

export default function LocationSelector({ locations, selectedLocation, isOpen, setSelectedLocation, setIsOpen }) {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null); // Add button ref
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [filteredLocations, setFilteredLocations] = useState(locations);

    const handleChangeInput = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim() === "") {
            setFilteredLocations(locations);
        } else {
            const filtered = locations.filter((location) =>
                location.name.toLocaleLowerCase('tr').includes(value.toLocaleLowerCase('tr'))
            );
            setFilteredLocations(filtered);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current && // Check button ref instead
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <button 
                ref={buttonRef} // Add ref to button
                type="button" 
                onClick={() => setIsOpen(!isOpen)} 
                className={`w-full h-12 px-4 bg-white border-2 rounded-xl font-medium text-gray-700 flex items-center justify-between transition-all ${
                    isOpen ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <span className="truncate">{selectedLocation.name}</span>
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div ref={dropdownRef} className="absolute z-50 mt-2 w-full bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleChangeInput}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                            placeholder="..."
                        />
                    </div>
                    <div className="max-h-64 overflow-auto">
                        {filteredLocations && filteredLocations.map((location, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                                    selectedLocation.id === location.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                } ${index !== filteredLocations.length - 1 ? 'border-b border-gray-100' : ''}`}
                                onClick={() => {
                                    setSelectedLocation(location);
                                    setIsOpen(false);
                                    setInputValue('');
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{location.name}</span>
                                    {selectedLocation.id === location.id && (
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}