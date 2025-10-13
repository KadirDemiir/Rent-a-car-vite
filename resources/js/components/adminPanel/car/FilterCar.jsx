import {useEffect, useState} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx"
import useClickOutside from "../../useClickOutside.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";

export default function FilterCar({cars, setFilteredCars}) {
    const {t} = useTranslation();
    const [error, setError] = useState();
    const [openFilter, setOpenFilter] = useState(false);
    /*const [brand, setBrand] = useState([]);*/
    const [segment, setSegment] = useState([]);
    const [bodyType, setBodyType] = useState([]);
    const [transmission, setTransmission] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [fuelType, setFuelType] = useState([]);
    const [segmentsOptions, setSegmentsOptions] = useState([]);
    const [bodyTypeOptions, setBodyTypeOptions] = useState([]);
    const [fuelOptions, setFuelOptions] = useState([]);
    const [transmissionOptions, setTransmissionOptions] = useState([]);
    /*const [brandOptions, setBrandOptions] = useState(() => cars.map(car => car.brand_key));*/
    const wrapperRef = useClickOutside(() => setOpenFilter(false));

    useEffect(() => {
        axios.get('/adminpanel/get-all-cars-info')
            .then(res => {
                setSegmentsOptions(res.data.segments);
                setBodyTypeOptions(res.data.bodyTypes);
                setFuelOptions(res.data.fuels);
                setTransmissionOptions(res.data.transmissions);
            })
            .catch(err => {
                setError(err.response?.data?.error);
            })
    }, []);
    const handleFilterToggle = () => {
        setOpenFilter(prev => !prev);
    };

    const handleFilter = () => {
        const filters = {
            segment: segment,
            body_type: bodyType,
            transmission_type: transmission,
            fuel_type: fuelType,
        };

        const selectedCars = cars.filter(car => {
            return Object.entries(filters).every(([key, values]) =>
                    values.length === 0 || values.includes("") || values.includes(car[key].toLowerCase())
                ) &&
                (car.price && minPrice === "" || Number(car.price) >= Number(minPrice)) &&
                (car.price && maxPrice === "" || Number(car.price) <= Number(maxPrice));
        });

        setFilteredCars(selectedCars);
    };

    const filterInput = (search) => {
        console.log(search);
        if (!search) {
            setFilteredCars(cars);
            return;
        }
        const lowerSearch = search.toLowerCase();
        const plakaMatches = cars.filter(car => car.license_plate.toLowerCase().includes(lowerSearch));
        const brandMatches = cars.filter(car => t(car.brand_key.key).toLowerCase().includes(lowerSearch) && !plakaMatches.includes(car));
        const modelMatches = cars.filter(car => t(car.model_key.key).toLowerCase().includes(lowerSearch) && !plakaMatches.includes(car) && !brandMatches.includes(car));
        const segmentMatches = cars.filter(car => t(`segment.${car.segment_id}`).toLowerCase().includes(lowerSearch) && !plakaMatches.includes(car) && !brandMatches.includes(car) && !modelMatches.includes(car));
        const yearMatches = cars.filter(car => car.year.toString().includes(lowerSearch) && !plakaMatches.includes(car) && !brandMatches.includes(car) && !modelMatches.includes(car) && !segmentMatches.includes(car));
        const sortedCars = [...plakaMatches, ...brandMatches, ...modelMatches, ...segmentMatches, ...yearMatches];
        setFilteredCars(sortedCars);
    };


    return (
        <div className="w-full flex sm:flex-col md:flex-row items-center justify-center gap-8 p-6 px-24 bg-gray-100 rounded-xl">
            <div ref={wrapperRef} className="relative inline-block">
                <div
                    className="w-72 flex items-center justify-center gap-2 border border-gray-400 p-2 rounded-xl cursor-pointer"
                    onClick={handleFilterToggle}
                >
                    <img src="/storage/svg/filter.svg" alt="" className="h-3" />
                    <span>{t("adminpanel.cars.filter.filter_label")}</span>
                </div>

                {openFilter && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded p-4 shadow-lg z-50 w-72">
                        <h3 className="text-xl font-semibold mb-4">{t("adminpanel.cars.filter.filter_label")}</h3>

{/*                        <div className="mb-4">
                            <SelectOptions value={brand} options={[{label: "all", value: ""}, ...brandOptions.map(b => ({label: t(b.translation_key), value: b.id}))]} onChange={setBrand} options_name={t("adminpanel.cars.filter.car_filter")} multiple={true}/>
                        </div>*/}

                        <div className="mb-4"><SelectOptions value={segment} options={[{label: "all", value: ""}, ...segmentsOptions.map(s => ({label: t(s.translation_key.key), value: t(s.translation_key.key).toLowerCase()}))]} onChange={setSegment} options_name={t("adminpanel.cars.filter.segment")} multiple={true}/></div>
                        <div className="mb-4"><SelectOptions value={bodyType} options={[{label: "all", value: ""}, ...bodyTypeOptions.map(b => ({label: t(b.translation_key.key), value: t(b.translation_key.key).toLowerCase()}))]} onChange={setBodyType} options_name={t("adminpanel.cars.filter.body_type")} multiple={true}/></div>
                        <div className="mb-4"><SelectOptions value={transmission} options={[{label: "all", value: ""}, ...transmissionOptions.map(a => ({label: t(a.translation_key.key), value: t(a.translation_key.key).toLowerCase()}))]} onChange={setTransmission} options_name={t("adminpanel.cars.filter.transmission_type")} multiple={true}/></div>
                        <div className="mb-4"><SelectOptions value={fuelType} options={[{label: "all", value: ""}, ...fuelOptions.map(f => ({label: t(f.translation_key.key), value: t(f.translation_key.key).toLowerCase()}))]} onChange={setFuelType} options_name={t("adminpanel.cars.filter.fuel_type")} multiple={true}/></div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block">{t("adminpanel.cars.filter.price_range")}</label>
                            <div className="flex gap-2">
                                <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 border border-gray-300 rounded px-2 py-1 outline-none"/>
                                <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 border border-gray-300 rounded px-2 py-1 outline-none"/>
                            </div>
                        </div>

                        <button onClick={handleFilter} className="w-full bg-blue-500 text-white py-2 rounded-xl">
                            {t("adminpanel.cars.filter.button.filter")}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span>Filtre:</span>
                <input onChange={(e) => filterInput(e.target.value)} type="text" placeholder={t("adminpanel.cars.filter.filter_label")} className="outline-none border border-black h-8 w-36 rounded-xl pl-2"/>
            </div>
        </div>
    );
}
