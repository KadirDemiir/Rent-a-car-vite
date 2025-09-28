import SelectOptions from "./SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function SegmentSelector({ value, onChange }) {
    const {t} = useTranslation();
  return (
      <div className="w-48">
        <SelectOptions
            value={value}
            onChange={onChange}
            options={[
            { label: "Tümü", value: "" },
            { label: "Ekonomik", value: "ekonomik" },
            { label: "Orta SInıf", value: "orta" },
            { label: "lüks", value: "lux" },
            { label: "minivan", value: "minivan" },
            ]}
            options_name= {t("website.searchReservation.filter.segments_label")}
        />
      </div>
  );
}
