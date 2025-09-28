import { useState } from "react";
import Td from "../table/Td.jsx";
import ShowResCard from "../reservations/ShowResCard.jsx";
import ChevronNavigation from "../reservations/ChevronNavigation.jsx";
import {useTranslation} from "react-i18next";

export default function CarReservations({ res }) {
    const {t} = useTranslation();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const perPage = 3;

  const TDclass = "border border-gray-500 px-4 py-2";
  const headers = [
    t("adminpanel.reservation.name_and_surname"), t("adminpanel.reservation.pick_up_date"), t("adminpanel.reservation.return_date"), t("adminpanel.reservation.payment_status"), t("adminpanel.reservation.status")
  ];

  const handleRowClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const closeModal = () => {
    setSelectedReservation(null);
  };

  const reservations =  [
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Ali",
            soyad: "Yılmaz",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "İstanbul",
            iade: "05.01.2024",
            iadeYeri: "Ankara",
            ekstra: "1000",
            toplam: "4.200₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        },
        {
            ad: "Veli",
            soyad: "Yılar",
            numara: "0555 123 45 67",
            alis: "01.01.2024",
            alisYeri: "Ankara",
            iade: "05.01.2024",
            iadeYeri: "Nevşehir",
            ekstra: "500",
            toplam: "4.700₺",
            durum: "Tamamlanmadı",
            odemeDurumu: "Ödendi"
        }
    ];

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
            <tr
              key={startIndex + index}
              onClick={() => handleRowClick(r)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Td
                cls={TDclass}
                contents={[
                  r.ad + " " + r.soyad,
                  r.alis,
                  r.iade,
                  <span className="text-green-600 font-semibold" key="odeme">
                    {r.odemeDurumu}
                  </span>,
                    <span className={`font-semibold ${r.durum.toLocaleLowerCase() === "tamamlandı" ? "text-green-600" : "text-red-600"}`}>
                      {r.durum}
                  </span>,
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>

      < ChevronNavigation
        handlePrev={handlePrev}
        handleNext={handleNext}
        startIndex={startIndex}
        perPage={perPage}
        currentPage={currentPage}
        totalPages={totalPages}
        length={reservations.length}
      />
      {selectedReservation && (
        <ShowResCard res={selectedReservation} closeModal={closeModal} isRes={res} />
      )}
    </div>
  );
}
