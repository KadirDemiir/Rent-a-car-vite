export default function ReservationAction({ closeModal, res }) {
    const handleApprove = () => {
        const confirm = window.confirm(`${res.name} ${res.surname} adlı kişinin rezervasyonunu onaylamak istediğinize emin misiniz?`);
        if (confirm) {
            alert(`Rezervasyon onaylandı: ${res.name} ${res.surname}`);
            closeModal();
        }
    };

    return (
        <div className="mt-2 flex items-center justify-end gap-3 pt-2">
            <button
                onClick={() => closeModal()}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 font-medium transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
                İptal Et
            </button>

            <button
                onClick={() => handleApprove()}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-100 transition-all duration-200 active:scale-95 cursor-pointer"
            >
                Onaylax
                <svg className="w-5 h-5 text-green-100 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </button>
        </div>
    );
}
