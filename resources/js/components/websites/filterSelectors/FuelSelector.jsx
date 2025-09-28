import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function FuelSelector({ value, onChange }) {
    const {t} = useTranslation();
  return (
      <div className="w-48">
        <SelectOptions
          value={value}
          onChange={onChange}
          options={[
            { label: "All", value: "" },
            { label: "Benzin", value: "gasoline" },
            { label: "Dizel", value: "diesel" },
            { label: "Elektrikli", value: "electric" },
            { label: "Hibrit", value: "hybrid" },
          ]}
          options_name={t("website.searchReservation.filter.fuel_type_label")}
        />
      </div>
  );
}
