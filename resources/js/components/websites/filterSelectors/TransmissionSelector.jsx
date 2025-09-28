import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function TransmissionSelector({ value, onChange }) {
    const {t} = useTranslation();
  return (
      <div className="w-48">
        <SelectOptions
            value={value}
            onChange={onChange}
            options={[
            { label: "All", value: "" },
            { label: "Otomatik", value: "automatic" },
            { label: "Manuel", value: "Manuel" },
            ]}
            options_name= {t("website.searchReservation.filter.transmission_type_label")}
        />
      </div>
  );
}
