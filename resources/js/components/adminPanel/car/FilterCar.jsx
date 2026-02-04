import {useEffect, useMemo, useState} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {SlidersHorizontal} from 'lucide-react';

export default function FilterCar({cars, setFilteredCars}) {
    const {t} = useTranslation();
    const [error, setError] = useState();
    const [openFilter, setOpenFilter] = useState(false);
    const [segment, setSegment] = useState([]);
    const [bodyType, setBodyType] = useState([]);
    const [transmission, setTransmission] = useState([]);
    const [fuelType, setFuelType] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [segmentsOptions, setSegmentsOptions] = useState([]);
    const [bodyTypeOptions, setBodyTypeOptions] = useState([]);
    const [fuelOptions, setFuelOptions] = useState([]);
    const [transmissionOptions, setTransmissionOptions] = useState([]);
    const filterLabel = t("adminpanel.cars.filter.filter_label");
    const helperText = t("adminpanel.cars.filter.helper_text", {
        defaultValue: "Search, refine, or reset filters to update the list.",
    });
    const showFiltersLabel = t("adminpanel.cars.filter.button.show", {defaultValue: "Show filters"});
    const hideFiltersLabel = t("adminpanel.cars.filter.button.hide", {defaultValue: "Hide filters"});
    const resetLabel = t("adminpanel.cars.filter.button.reset", {defaultValue: "Reset"});
    const advancedLabel = t("adminpanel.cars.filter.advanced", {defaultValue: "Advanced filters"});
    const searchPlaceholder = t("adminpanel.cars.filter.search_placeholder", {defaultValue: filterLabel});

    useEffect(() => {
        axios.get("/adminpanel/get-all-cars-info")
            .then(res => {
                setSegmentsOptions(res.data.segments);
                setBodyTypeOptions(res.data.bodyTypes);
                setFuelOptions(res.data.fuels);
                setTransmissionOptions(res.data.transmissions);
            })
            .catch(err => {
                setError(err.response?.data?.error);
            });
    }, []);

    const filters = useMemo(() => ({
        segment,
        body_type: bodyType,
        transmission_type: transmission,
        fuel_type: fuelType,
    }), [segment, bodyType, transmission, fuelType]);

    const resetFilters = () => {
        setSegment([]);
        setBodyType([]);
        setTransmission([]);
        setFuelType([]);
        setMinPrice("");
        setMaxPrice("");
        setSearchTerm("");
        setFilteredCars(cars);
    };

    const handleFilterToggle = () => setOpenFilter(prev => !prev);

    const handleFilter = () => {
        const selectedCars = cars.filter(car => {
            const matchesFilters = Object.entries(filters).every(([key, values]) =>
                values.length === 0 || values.includes("") || values.includes(car[key]?.toLowerCase())
            );
            const matchesPriceMin = minPrice === "" || (car.price && Number(car.price) >= Number(minPrice));
            const matchesPriceMax = maxPrice === "" || (car.price && Number(car.price) <= Number(maxPrice));
            return matchesFilters && matchesPriceMin && matchesPriceMax;
        });

        setFilteredCars(selectedCars);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (!value) {
            setFilteredCars(cars);
            return;
        }

        const lowerSearch = value.toLowerCase();
        const plakaMatches = cars.filter(car => car.license_plate?.toLowerCase().includes(lowerSearch));
        const brandMatches = cars.filter(car =>
            t(car.brand_key.key).toLowerCase().includes(lowerSearch) && !plakaMatches.includes(car)
        );
        const modelMatches = cars.filter(car =>
            t(car.model_key.key).toLowerCase().includes(lowerSearch) &&
            !plakaMatches.includes(car) &&
            !brandMatches.includes(car)
        );
        const segmentMatches = cars.filter(car =>
            t(`segment.${car.segment_id}`).toLowerCase().includes(lowerSearch) &&
            !plakaMatches.includes(car) &&
            !brandMatches.includes(car) &&
            !modelMatches.includes(car)
        );
        const yearMatches = cars.filter(car =>
            car.year?.toString().includes(lowerSearch) &&
            !plakaMatches.includes(car) &&
            !brandMatches.includes(car) &&
            !modelMatches.includes(car) &&
            !segmentMatches.includes(car)
        );
        const sortedCars = [...plakaMatches, ...brandMatches, ...modelMatches, ...segmentMatches, ...yearMatches];
        setFilteredCars(sortedCars);
    };

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        {filterLabel}
                    </p>
                    <p className="text-xs text-gray-500">{helperText}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleFilterToggle}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400"
                    >
                        {/*<img src="/storage/svg/filter.svg" alt="" className="h-3" />*/}
                        <SlidersHorizontal/>
                        {openFilter ? hideFiltersLabel : showFiltersLabel}
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center rounded-xl border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                    >
                        {resetLabel}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1 min-w-60">
                    <input
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:bg-white"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.23-5.4a6.58 6.58 0 11-13.16 0 6.58 6.58 0 0113.16 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="uppercase tracking-wide">{advancedLabel}</span>
                    <span className="h-px flex-1 bg-gray-200" />
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                    {error}
                </p>
            )}

            {openFilter && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SelectOptions
                            value={segment}
                            options={[{label: "all", value: ""}, ...segmentsOptions.map(id => ({
                                label: t(`segment.${id}`),
                                value: t(`segment.${id}`).toLowerCase(),
                            }))]}
                            onChange={setSegment}
                            options_name={t("adminpanel.cars.filter.segment")}
                            multiple={true}
                        />
                        <SelectOptions
                            value={bodyType}
                            options={[{label: "all", value: ""}, ...bodyTypeOptions.map(id => ({
                                label: t(`body_type.${id}`),
                                value: t(`body_type.${id}`).toLowerCase(),
                            }))]}
                            onChange={setBodyType}
                            options_name={t("adminpanel.cars.filter.body_type")}
                            multiple={true}
                        />
                        <SelectOptions
                            value={transmission}
                            options={[{label: "all", value: ""}, ...transmissionOptions.map(id => ({
                                label: t(`transmission.${id}`),
                                value: t(`transmission.${id}`).toLowerCase(),
                            }))]}
                            onChange={setTransmission}
                            options_name={t("adminpanel.cars.filter.transmission_type")}
                            multiple={true}
                        />
                        <SelectOptions
                            value={fuelType}
                            options={[{label: "all", value: ""}, ...fuelOptions.map(id => ({
                                label: t(`fuel.${id}`),
                                value: t(`fuel.${id}`).toLowerCase(),
                            }))]}
                            onChange={setFuelType}
                            options_name={t("adminpanel.cars.filter.fuel_type")}
                            multiple={true}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("adminpanel.cars.filter.price_range")}
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min"
                                className="rounded-2xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max"
                                className="rounded-2xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300"
                        >
                            {resetLabel}
                        </button>
                        <button
                            type="button"
                            onClick={handleFilter}
                            className="inline-flex items-center justify-center rounded-2xl bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                        >
                            {t("adminpanel.cars.filter.button.filter")}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
