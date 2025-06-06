export default function ReservationAction({closeModal, res}){
    const handleApprove = () => {
        console.log(res);
        const confirm = window.confirm(`${res.ad} ${res.soyad} adlı kişinin rezervasyonunu onaylamak istediğinize emin misiniz?`);
        if (confirm) {
            alert(`Rezervasyon onaylandı: ${res.ad} ${res.soyad}`);
            closeModal();
        }
    };
    return(
        <div className="mt-6 flex justify-end gap-2">
            <button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl cursor-pointer"
            >
                Onayla
            </button>
            <button
                onClick={closeModal}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl cursor-pointer"
            >
                İptal Et
            </button>
        </div>
    );
}
