export default function LocationSelector({selectedLocation, isOpen, locations, setSelectedLocation, setIsOpen})
{

    return(
    <>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="border w-full h-12 text-xl font-semibold flex items-center justify-start pl-4 rounded-md">
            {selectedLocation}
        </button>
        {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md p-4">
                <input type="text" className="w-full p-2 border rounded-md outline-none" placeholder="Lokasyon ara..." />
                <div className="max-h-50 overflow-auto">
                {locations.map((location) => (
                    <div key={location} className="h-10 mt-2">
                        <button type="button" className="h-full cursor-pointer w-full" 
                         onClick={() => {
                             setSelectedLocation(location);  
                             setIsOpen(false);              
                            }}
                            >
                            {location}
                        </button>
                        <hr className="border-gray-300" />
                    </div>
                ))}
                </div>
            </div>
        )}
    </>
    );
}