import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function SegmentSelector({ value, onChange, options = [] }) {
    const {t} = useTranslation();


    return (
        <div className="w-48">
            <SelectOptions
                multiple={true}
                value={value}
                onChange={onChange}
                options={options}
                options_name={t("website.searchReservation.filter.segments_label")}
            />
        </div>
    );
}
