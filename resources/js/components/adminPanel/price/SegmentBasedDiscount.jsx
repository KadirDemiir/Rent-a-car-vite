import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import { useState, useEffect } from "react";

export default function SegmentBasedDiscount({ selectedSegment, onChange }) {
    const options = [
        { label: "--Seçiniz--", value: "" },
        { label: "Economy", value: "economy" },
        { label: "Compact", value: "compact" },
        { label: "Orta Sınıf", value: "midrange" },
        { label: "Premium", value: "premium" },
    ];

    const [value, setValue] = useState(selectedSegment || "");

    useEffect(() => {
        setValue(selectedSegment || "");
    }, [selectedSegment]);

    const handleChange = (e) => {
        setValue(e);
        onChange(e);
    };

    return (
        <div className="w-full">
            <SelectOptions
                value={value}
                options={options}
                onChange={handleChange}
                options_name="Segment seçiniz"
            />
        </div>
    );
}
