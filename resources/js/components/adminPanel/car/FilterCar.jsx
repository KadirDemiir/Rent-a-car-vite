import { useState } from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx"
import useClickOutside from "../../useClickOutside.jsx";

export default function FilterCar() {
    const [openFilter, setOpenFilter] = useState(false);
    const [brand, setBrand] = useState("");
    const [segment, setSegment] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [transmission, setTransmission] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [fuelType, setFuelType] = useState("");

    const wrapperRef = useClickOutside(() => setOpenFilter(false));

    const handleFilterToggle = () => {
        setOpenFilter(prev => !prev);
    };

    const brandOnChange = (e) => {setBrand(e)};
    const segmentOnChange = (e) => {setSegment(e)};
    const bodyTypeOnChange = (e) => {setBodyType(e)};
    const transmissionOnChange = (e) => {setTransmission(e)};
    const fuelTypeOnChange = (e) => {setFuelType(e)};


    return (
        <div className="w-full flex sm:flex-col md:flex-row items-center justify-center gap-8 p-6 px-24 bg-gray-100 rounded-xl">
            <div ref={wrapperRef} className="relative inline-block">
                <div
                    className="w-72 flex items-center justify-center gap-2 border border-gray-400 p-2 rounded-xl cursor-pointer"
                    onClick={handleFilterToggle}
                >
                    <img src="/storage/svg/filter.svg" alt="" className="h-3" />
                    <span>Filtrele</span>
                </div>

                {openFilter && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-4 shadow-lg z-50 w-72">
                        <h3 className="text-xl font-semibold mb-4">Araç Filtreleri</h3>

                        <div className="mb-4">
                            <SelectOptions
                                value={brand}
                                options={[
                                    {label: "tümü", value: ""},
                                    {label: "Mercedes", value: "mercedes"},
                                    {label: "Mercedes", value: "a"},
                                    {label: "Mercedes", value: "b"}]}
                                onChange={brandOnChange}
                                options_name={"Marka"}
                                multiple={true}
                            />
                        </div>

                        <div className="mb-4">
                            <SelectOptions
                                value={segment}
                                options={[{label: "Segment", value: "mercedes"}]}
                                onChange={segmentOnChange}
                                options_name={"Segment"}
                                multiple={true}
                            />
                        </div>
                        <div className="mb-4">
                            <SelectOptions
                                value={bodyType}
                                options={[{label: "Araç Tipi", value: "mercedes"}]}
                                onChange={bodyTypeOnChange}
                                options_name={"Body Type"}
                                multiple={true}
                            />
                        </div>
                        <div className="mb-4">
                            <SelectOptions
                                value={transmission}
                                options={[{label: "Transmission", value: "mercedes"}]}
                                onChange={transmissionOnChange}
                                options_name={"Transmission Type"}
                                multiple={true}
                            />
                        </div>
                        <div className="mb-4">
                            <SelectOptions
                                value={fuelType}
                                options={[{label: "Fuel Type", value: "mercedes"}]}
                                onChange={fuelTypeOnChange}
                                options_name={"Fuel Type"}
                                multiple={true}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block">Fiyat Aralığı</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    id="minPrice"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                    className="w-1/2 border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                    type="number"
                                    id="maxPrice"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                    className="w-1/2 border border-gray-300 rounded px-2 py-1"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-blue-500 text-white py-2 rounded-xl">
                            Filtrele
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span>Filtre:</span>
                <input type="text" placeholder="Plaka, marka vb." className="outline-none border border-black h-8 w-36 rounded-xl pl-2"/>
            </div>
        </div>
    );
}
