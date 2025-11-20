import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import { useState, useEffect, useMemo } from "react";
import {useTranslation} from "react-i18next";

export default function SegmentBasedDiscount({ selectedSegment, onChange, segments }) {
    const {t} = useTranslation();
    const [value, setValue] = useState(selectedSegment || "");

    useEffect(() => {
        setValue(selectedSegment || "");
    }, [selectedSegment]);

    const handleChange = (e) => {
        setValue(e);
        onChange(e);
    };

    const segmentOptions = useMemo(() => {
        if (!segments || !Array.isArray(segments)) {
            return [];
        }
        return segments.map(segment => ({
            label: t(`segment.${segment.id}`),
            value: segment.id
        }));
    }, [segments, t]);

    return (
        <div className="w-full">
            <SelectOptions
                value={value ? [value] : []}
                options={segmentOptions}
                onChange={handleChange}
                options_name={t("adminpanel.pricing.add_discount.choose_a_segment")}
            />
        </div>
    );
}
