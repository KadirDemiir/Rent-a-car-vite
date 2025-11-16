import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function TransmissionSelector({ value, onChange, options = [] }) {
    const {t} = useTranslation();
    const defaultOptions = [
        { label: "All", value: "" },
        { label: "Otomatik", value: "automatic" },
        { label: "Manuel", value: "Manuel" },
    ];

    const arrayValue = Array.isArray(value) ? value : (value !== undefined && value !== null ? [value] : []);

    const handleChange = (newValue) => {
        if (Array.isArray(newValue)) {
            onChange(newValue[0] || "");
        } else {
            onChange(newValue);
        }
    };

    return (
        <div className="w-48">
            <SelectOptions
                multiple={true}
                value={arrayValue}
                onChange={handleChange}
                options={options.length > 0 ? options : defaultOptions}
                options_name={t("website.searchReservation.filter.transmission_type_label")}
            />
        </div>
    );
}
