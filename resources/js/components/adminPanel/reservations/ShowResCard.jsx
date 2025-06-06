import ReservationAction from "./ReservationAction.jsx";

export default function ShowResCard({ res, closeModal, isRes}) {
    res.ekstraHizmetler = [
        { ad: "Bebek Koltuğu", tutar: "800₺" },
        { ad: "Navigasyon", tutar: "200₺" }
    ];

    const handleApprove = () => {
        const confirm = window.confirm(`${res.ad} ${res.soyad} adlı kişinin rezervasyonunu onaylamak istediğinize emin misiniz?`);
        if (confirm) {
            alert(`Rezervasyon onaylandı: ${res.ad} ${res.soyad}`);
            closeModal();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white w-[80%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-6">Rezervasyon Detayı</h2>

                {/* FLEX Container: Ana Bilgiler ve Ekstra Hizmetler Yan Yana */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sol Sütun: Rezervasyon Bilgileri */}
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
                        <dt className="font-semibold">Ad</dt>
                        <dd>{res.ad}</dd>

                        <dt className="font-semibold">Soyad</dt>
                        <dd>{res.soyad}</dd>

                        <dt className="font-semibold">Numara</dt>
                        <dd>{res.numara}</dd>

                        <dt className="font-semibold">Alış</dt>
                        <dd>{res.alis}</dd>

                        <dt className="font-semibold">Alış Yeri</dt>
                        <dd>{res.alisYeri}</dd>

                        <dt className="font-semibold">İade</dt>
                        <dd>{res.iade}</dd>

                        <dt className="font-semibold">İade Yeri</dt>
                        <dd>{res.iadeYeri}</dd>

                        <dt className="font-semibold">Ekstra Tutar</dt>
                        <dd>{res.ekstra}</dd>

                        <dt className="font-semibold">Toplam Tutar</dt>
                        <dd>{res.toplam}</dd>

                        <dt className="font-semibold">Ödeme Yöntemi</dt>
                        <dd>{res.odemeYontemi}</dd>

                        <dt className="font-semibold">Ödeme Durumu</dt>
                        <dd className="text-green-600 font-semibold">{res.odemeDurumu}</dd>
                    </dl>

                    {/* Sağ Sütun: Ekstra Hizmetler */}
                    {res.ekstraHizmetler?.length > 0 && (
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Alınan Ekstra Hizmetler</h3>
                            <dl className="space-y-2">
                                {res.ekstraHizmetler.map((hizmet, index) => (
                                    <div key={index} className="flex items-center gap-x-2">
                                        <dt className="font-medium">{hizmet.ad}</dt>
                                        <dd className="text-gray-700 text-sm">{hizmet.tutar}</dd>
                                    </div>
                                ))}
                            </dl>

                        </div>
                    )}
                </div>

                {isRes &&
                    <ReservationAction closeModal={closeModal} res={res}/>
                }
            </div>
        </div>
    );
}
