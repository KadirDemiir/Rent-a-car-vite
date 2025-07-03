import SelectOptions from "./SelectOptions.jsx";

export default function SegmentSelector({ value, onChange }) {
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
            options_name="Segment"
        />
      </div>
  );
}
