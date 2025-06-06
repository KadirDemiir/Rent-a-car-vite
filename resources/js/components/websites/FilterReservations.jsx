import { useState, useEffect } from "react";
import SortSelector from './filterSelectors/SortSelector.jsx';
import FuelSelector from './filterSelectors/FuelSelector.jsx';
import SegmentSelector from "./filterSelectors/SegmentSelector.jsx";
import TransmissionSelector from "./filterSelectors/TransmissionSelector.jsx";

export default function FilterReservations({ onFilterChange }) {
  const [sort, setSort] = useState("increase");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [segment, setSegment] = useState("");

  useEffect(() => {
    onFilterChange({ sort, fuel, transmission, segment });
  }, [sort, fuel, transmission, segment]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <SortSelector value={sort} onChange={setSort} />
      <FuelSelector value={fuel} onChange={setFuel} />
      <SegmentSelector value={segment} onChange={setSegment} />
      <TransmissionSelector value={transmission} onChange={setTransmission} />
    </div>
  );
}
