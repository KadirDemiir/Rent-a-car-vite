import SelectOptions from "./SelectOptions.jsx";

export default function TransmissionSelector({ value, onChange }) {
  return (
      <div className="w-48">
        <SelectOptions
            value={value}
            onChange={onChange}
            options={[
            { label: "Tümü", value: "" },
            { label: "Otomatik", value: "automatic" },
            { label: "Manuel", value: "Manuel" },
            ]}
            options_name="Transmission Type"
        />
      </div>
  );
}
