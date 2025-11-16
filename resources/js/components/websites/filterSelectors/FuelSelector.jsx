import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function FuelSelector({ value, onChange, options = [] }) {
    const {t} = useTranslation();


    return (
        <div className="w-48">
            <SelectOptions
                multiple={true}
                value={value}
                onChange={onChange}
                options={options}
                options_name={t("website.searchReservation.filter.fuel_type_label")}
            />
        </div>
    );
}
