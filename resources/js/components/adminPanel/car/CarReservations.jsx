import { useState } from "react";
import Td from "../table/Td.jsx";
import ShowResCard from "../reservations/ShowResCard.jsx";
import ChevronNavigation from "../reservations/ChevronNavigation.jsx";
import {useTranslation} from "react-i18next";

export default function  CarReservations({ reservations, res=true }) {
    console.log(reservations)
  const {t} = useTranslation();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const perPage = 10;

  const TDclass = "border border-gray-500 px-4 py-2";
  const headers = [t("adminpanel.reservation.name_and_surname"), t("adminpanel.reservation.pick_up_date"), t("adminpanel.reservation.return_date"), t("adminpanel.reservation.payment_status"), t("adminpanel.reservation.status")];

  const closeModal = () => {
    setSelectedReservation(null);
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - perPage, 0));
  };

  const handleNext = () => {
    if (startIndex + perPage < reservations.length) {
      setStartIndex(startIndex + perPage);
    }
  };

  const currentReservations = reservations.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(reservations.length / perPage);
  const currentPage = Math.floor(startIndex / perPage) + 1;

  return (
    <div className="relative">
      <table className="table-auto w-full border border-gray-500 border-collapse mt-2">
        <thead className="bg-gray-100">
          <tr>
            <Td cls={TDclass} contents={headers} as="th" />
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((r, index) => (
            <tr  key={startIndex + index} onClick={() => setSelectedReservation(r)} className="cursor-pointer hover:bg-gray-100">
              <Td
                cls={TDclass}
                contents={[
                  r.name + " " + r.surname,
                    new Date(r.pickup_datetime).toLocaleString("tr-TR", { day:"numeric", month:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" }).replace(/\./g, " / "),
                    new Date(r.return_datetime).toLocaleString("tr-TR", { day:"numeric", month:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" }).replace(/\./g, " / "),
                  <span className={`${r.payment_status.toLowerCase() === 'paid' ? 'text-green-600' : r.payment_status.toLowerCase() === 'failed' ? 'text-red-600' : 'text-yellow-600'} font-semibold`} key="odeme">
                    {r.payment_status}
                  </span>,
                    <span className={`font-semibold ${r.status.toLocaleLowerCase() === "pending" ? "text-yellow-600" : r.status.toLocaleLowerCase() === "confirmed" ? "text-green-600" : r.status.toLocaleLowerCase() === "cancelled" ? "text-red-600" : "text-black"} `}>
                      {r.status}
                  </span>,
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>

      < ChevronNavigation handlePrev={handlePrev} handleNext={handleNext} startIndex={startIndex} perPage={perPage} currentPage={currentPage} totalPages={totalPages} length={reservations.length}/>
      {selectedReservation && (
        <ShowResCard res={selectedReservation} closeModal={closeModal} isRes={res} />
      )}
    </div>
  );
}
