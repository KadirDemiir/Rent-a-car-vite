import { useState, useEffect } from "react";
import SortSelector from './filterSelectors/SortSelector.jsx';
import FuelSelector from './filterSelectors/FuelSelector.jsx';
import SegmentSelector from "./filterSelectors/SegmentSelector.jsx";
import TransmissionSelector from "./filterSelectors/TransmissionSelector.jsx";
import axios from "axios";
import {t} from "i18next";

export default function FilterReservations({ onFilterChange }) {
  const [sort, setSort] = useState("increase");
  const [fuel, setFuel] = useState("");
  const [fuelOpt, setFuelOpt] = useState([]);
  const [transmission, setTransmission] = useState("");
  const [transmissionOpt, setTransmissionOpt] = useState([]);
  const [segment, setSegment] = useState("");
  const [segmentOpt, setSegmentOpt] = useState([]);

  useEffect(() => {
      console.log(fuel)
    onFilterChange({ sort, fuel, transmission, segment });
  }, [sort, fuel, transmission, segment]);

  useEffect(() => {
      axios.get('/get-all-cars-info')
          .then(res => {
              const fuelOptions = [
                  { label: "All", value: "" },
                  ...res.data.fuels
                      .map(f => ({
                          label: t(`fuel.${f.id}`),
                          value: f.id.toString()}))];
              setFuelOpt(fuelOptions);

              const segmentOptions = [
                  { label: "All", value: "" },
                  ...res.data.segments
                      .map(s => ({
                          label: t(`segment.${s.id}`),
                          value: s.id.toString()
                      }))
              ];
              setSegmentOpt(segmentOptions);

              const transmissionOptions = [
                  { label: "All", value: "" },
                  ...res.data.transmissions
                      .map(tr => ({
                          label: t(`transmission.${tr.id}`),
                          value: tr.id.toString()
                      }))
              ];
              setTransmissionOpt(transmissionOptions);
          })
          .catch(err => {
              console.error("Error fetching car info:", err);
          });
  }, []);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <SortSelector value={sort} onChange={setSort} />
      <FuelSelector value={fuel} onChange={(e) => setFuel(e)} options={fuelOpt} />
      <SegmentSelector value={segment} onChange={(e) => setSegment(e)} options={segmentOpt} />
      <TransmissionSelector value={transmission} onChange={setTransmission} options={transmissionOpt} />
    </div>
  );
}
