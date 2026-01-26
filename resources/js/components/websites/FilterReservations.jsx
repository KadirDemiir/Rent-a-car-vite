import { useState, useEffect } from "react";
import SortSelector from './filterSelectors/SortSelector.jsx';
import FuelSelector from './filterSelectors/FuelSelector.jsx';
import SegmentSelector from "./filterSelectors/SegmentSelector.jsx";
import TransmissionSelector from "./filterSelectors/TransmissionSelector.jsx";
import axios from "axios";
import {t} from "i18next";
import { Filter, X } from 'lucide-react';

export default function FilterReservations({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState("default");
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
    <div className="w-full flex flex-col items-center">
        <div className={`md:hidden w-full mb-4 px-4 rounded-md flex items-center justify-start`}>
            <button
                className=" bg-gray-200 text-gray-700 p-2 gap-2"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <X size={20} /> : <Filter size={20} />}
            </button>
          </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center w-full`}>
        <SortSelector value={sort} onChange={setSort} />
        <FuelSelector value={fuel} onChange={(e) => setFuel(e)} options={fuelOpt} />
        <SegmentSelector value={segment} onChange={(e) => setSegment(e)} options={segmentOpt} />
        <TransmissionSelector value={transmission} onChange={setTransmission} options={transmissionOpt} />
      </div>
    </div>
  );
}
