import React, { useState, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Filter, X } from 'lucide-react';
import SortSelector from './filterSelectors/SortSelector.jsx';
import FuelSelector from './filterSelectors/FuelSelector.jsx';
import SegmentSelector from "./filterSelectors/SegmentSelector.jsx";
import TransmissionSelector from "./filterSelectors/TransmissionSelector.jsx";

const FilterReservations = ({ onFilterChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Filtre State'leri
    const [filters, setFilters] = useState({
        sort: "default",
        fuel: "",
        segment: "",
        transmission: ""
    });

    // API'den gelen ham veriyi tutan state
    const [metaData, setMetaData] = useState({
        fuels: [],
        segments: [],
        transmissions: []
    });

    useEffect(() => {
        let isMounted = true;

        axios.get('/get-all-cars-info')
            .then(res => {
                if (isMounted && res.data) {
                    setMetaData({
                        fuels: res.data.fuels || [],
                        segments: res.data.segments || [],
                        transmissions: res.data.transmissions || []
                    });
                }
            })
            .catch(err => console.error(err));

        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const fuelOptions = useMemo(() => [
        { label: "All", value: "" },
        ...metaData.fuels.map(id => ({ label: t(`fuel.${id}`), value: id.toString() }))
    ], [metaData.fuels, t]);

    const segmentOptions = useMemo(() => [
        { label: "All", value: "" },
        ...metaData.segments.map(id => ({ label: t(`segment.${id}`), value: id.toString() }))
    ], [metaData.segments, t]);

    const transmissionOptions = useMemo(() => [
        { label: "All", value: "" },
        ...metaData.transmissions.map(id => ({ label: t(`transmission.${id}`), value: id.toString() }))
    ], [metaData.transmissions, t]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="md:hidden w-full mb-4 px-4 rounded-md flex items-center justify-start">
                <button
                    className="bg-gray-200 text-gray-700 p-2 gap-2 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label="Toggle Filters"
                >
                    {isOpen ? <X size={20} /> : <Filter size={20} />}
                </button>
            </div>

            <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center w-full`}>
                <SortSelector
                    value={filters.sort}
                    onChange={(val) => handleChange("sort", val)}
                />
                <FuelSelector
                    value={filters.fuel}
                    onChange={(val) => handleChange("fuel", val)}
                    options={fuelOptions}
                />
                <SegmentSelector
                    value={filters.segment}
                    onChange={(val) => handleChange("segment", val)}
                    options={segmentOptions}
                />
                <TransmissionSelector
                    value={filters.transmission}
                    onChange={(val) => handleChange("transmission", val)}
                    options={transmissionOptions}
                />
            </div>
        </div>
    );
};

export default memo(FilterReservations);
