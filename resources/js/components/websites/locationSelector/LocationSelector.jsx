import { useEffect, useRef, useState } from "react";

export default function LocationSelector({ locations, selectedLocation, isOpen, setSelectedLocation, setIsOpen }) {
    const dropdownRef = useRef(null);
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
                inputRef.current &&
                !inputRef.current.contains(event.target)
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
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="border w-full h-12 text-xl font-semibold flex items-center justify-start pl-4 rounded-md">
                {selectedLocation.name}
            </button>
            {isOpen && (
                <div ref={dropdownRef} className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleChangeInput}
                        className="w-full p-2 border rounded-md outline-none"
                        placeholder="Lokasyon ara..."
                    />
                    <div className="max-h-50 overflow-auto">
                        {filteredLocations && filteredLocations.map((location, index) => (
                            <div key={index} className="h-10 mt-2">
                                <button
                                    type="button"
                                    className="h-full cursor-pointer w-full"
                                         onClick={() => {
                                        setSelectedLocation(location);
                                        setIsOpen(false);
                                    }}
                                >
                                    {location.name}
                                </button>
                                <hr className="border-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
