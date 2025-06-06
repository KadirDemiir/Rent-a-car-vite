import Td from "../table/Td.jsx";
import ShowResCard from "../reservations/ShowResCard.jsx";
import {useState} from "react";
import Reservations from "../../../pages/adminPanel/reservation/Reservations.jsx";

export default function CarReservations({res}) {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const TDclass = "border border-gray-500 px-4 py-2";
    const headers = [
        "Ad", "Soyad", "Numara", "Alış", "Alış Yeri", "İade", "İade Yeri",
        "Ekstra Tutar", "Toplam Tutar", "Ödeme Yöntemi", "Ödeme Durumu"
    ];
    const handleRowClick = (reservation) => {
        setSelectedReservation(reservation);
    };

    const reservations = [
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
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
            odemeYontemi: "Kredi Kartı",
            odemeDurumu: "Ödendi"
        }
    ];

    const closeModal = () => {
        setSelectedReservation(null);
    };

    return (
        <div className="relative">
            <div className="space-x-4">
                <span className="font-bold">Aracın {res ? "Rezervasyonları" : "Geçmiş Kiralama Kayıtları"}</span>
                <span className="text-sm font-thin">{res ? "(Rezervasyonu yönetmek için tıklayınız)" : "(Detaylar İçin Tıklayınız)"}</span>
            </div>
            <div className="max-h-[40vh] overflow-y-scroll">
                <table className="table-auto w-full border border-gray-500 border-collapse mt-2">
                    <thead className="bg-gray-100">
                    <tr>
                        <Td cls={TDclass} contents={headers} as="th" />
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((r, index) => (
                        <tr key={index} onClick={() => handleRowClick(r)} className="cursor-pointer hover:bg-gray-100">
                            <Td
                                cls={TDclass}
                                contents={[
                                    r.ad, r.soyad, r.numara, r.alis, r.alisYeri,
                                    r.iade, r.iadeYeri, r.ekstra, r.toplam,
                                    r.odemeYontemi,
                                    <span className="text-green-600 font-semibold" key="odeme">
                                            {r.odemeDurumu}
                                        </span>
                                ]}
                            />
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {selectedReservation && (
                < ShowResCard res = {selectedReservation} closeModal = {closeModal} isRes={res}/>
            )}

        </div>
    );
}
