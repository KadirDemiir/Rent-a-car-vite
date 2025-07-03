import SelectOptions from "./SelectOptions.jsx";

export default function FuelSelector({ value, onChange }) {
  return (
      <div className="w-48">
        <SelectOptions
          value={value}
          onChange={onChange}
          options={[
            { label: "Tümü", value: "" },
            { label: "Benzin", value: "gasoline" },
            { label: "Dizel", value: "diesel" },
            { label: "Elektrikli", value: "electric" },
            { label: "Hibrit", value: "hybrid" },
          ]}
          options_name="Yakıt Türü"
        />
      </div>
  );
}
