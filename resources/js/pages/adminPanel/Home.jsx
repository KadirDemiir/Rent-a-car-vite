import { useTranslation } from 'react-i18next';
import Navbar from '../../components/adminPanel/navbar/Navbar.jsx';
import { useState, useEffect } from 'react';
import Confirm from '../../components/Confirm.jsx';
import axios from 'axios';

export default function Home({ upcomingReservations, activeReservations, lateReservations }) {
    const {t, i18n} = useTranslation();
    const [confirmModal, setConfirmModal] = useState(null);
    const [carSelectModal, setCarSelectModal] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [loadingCars, setLoadingCars] = useState(false);
    const [completeModal, setCompleteModal] = useState(null);
    const [currentKm, setCurrentKm] = useState('');

    const [upcoming, setUpcoming] = useState(upcomingReservations);
    const [active, setActive] = useState(activeReservations);
    const [late, setLate] = useState(lateReservations);


    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('tr-TR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const handleCardClick = (reservation, type) => {
        if (type === 'upcoming') {
            // Fetch available cars first
            setLoadingCars(true);
            axios.get(`/adminpanel/reservations/${reservation.id}/available-cars`)
                .then((response) => {
                    setAvailableCars(response.data.cars);
                    setSelectedCarId(null);
                    setCarSelectModal({ reservation });
                    setLoadingCars(false);
                })
                .catch(() => {
                    setLoadingCars(false);
                    alert('Uygun araçlar yüklenirken hata oluştu.');
                });
        } else if (type === 'active' || type === 'late') {
            setCurrentKm(reservation.assignedVehicle?.current_km?.toString() || '');
            setCompleteModal({ reservation, type });
        }
    };

    const handleCompleteRental = () => {
        if (!completeModal || !currentKm) return;

        const { reservation, type } = completeModal;
        axios.post(`/adminpanel/reservations/${reservation.id}/complete`, { current_km: parseInt(currentKm) })
            .then(() => {
                setCompleteModal(null);
                setCurrentKm('');
                if (type === 'active') {
                    setActive(prev => prev.filter(r => r.id !== reservation.id));
                } else {
                    setLate(prev => prev.filter(r => r.id !== reservation.id));
                }
            })
            .catch((error) => {
                alert(error.response?.data?.error || 'Kiralama tamamlanırken hata oluştu.');
            });
    };

    const handleStartRental = () => {
        if (!selectedCarId || !carSelectModal) return;

        const reservation = carSelectModal.reservation;
        axios.post(`/adminpanel/reservations/${reservation.id}/start`, { car_id: selectedCarId })
            .then(() => {
                setCarSelectModal(null);
                setSelectedCarId(null);
                setAvailableCars([]);
                setUpcoming(prev => prev.filter(r => r.id !== reservation.id));
                setActive(prev => [...prev, { ...reservation, status: 'active' }]);
            })
            .catch((error) => {
                alert(error.response?.data?.error || 'Kiralama başlatılırken hata oluştu.');
            });
    };

    const ReservationCard = ({ reservation, type }) => {
        const isLate = type === 'late';
        const borderColor = isLate ? 'border-red-500' : (type === 'active' ? 'border-green-500' : 'border-gray-500');
        const badgeColor = isLate ? 'bg-red-100 text-red-800' : (type === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800');
        const name = JSON.parse(reservation.car_group.name);
        return (
            <div
                onClick={() => handleCardClick(reservation, type)}
                className={`bg-white p-4 rounded-lg shadow border-l-4 ${borderColor} mb-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800">
                            {name?.[i18n.language]}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            {reservation.assigned_vehicle?.plate_number ?? '—'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {reservation.name} {reservation.surname}
                        </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badgeColor}`}>
                        {type === 'upcoming' ? 'Gelecek' : (type === 'active' ? 'Aktif' : 'Gecikmiş')}
                    </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Alış:</span>
                        <span className="font-medium text-gray-700">{formatDate(reservation.pickup_datetime)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Dönüş:</span>
                        <span className="font-medium text-gray-700">{formatDate(reservation.return_datetime)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {confirmModal && (
                <Confirm
                    message={confirmModal.message}
                    confirm={(isConfirmed) => {
                        if (isConfirmed) confirmModal.onConfirm();
                        else setConfirmModal(null);
                    }}
                />
            )}

            {/* Complete Rental Modal with KM Input */}
            {completeModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Kiralamayı Tamamla</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Aracı teslim almak için güncel kilometre bilgisini girin.
                        </p>
                        <p>
                            Rezervasyon Öncesi KM: <span>{completeModal?.reservation?.assigned_vehicle?.current_km ?? '—'}</span>
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Güncel Kilometre
                            </label>
                            <input
                                type="number"
                                value={currentKm}
                                onChange={(e) => setCurrentKm(e.target.value)}
                                placeholder="Örn: 45000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={() => {
                                    setCompleteModal(null);
                                    setCurrentKm('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleCompleteRental}
                                disabled={!currentKm}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                    currentKm 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Teslim Al
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Car Selection Modal */}
            {carSelectModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Araç Seçin</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Kiralama başlatmak için müsait bir araç seçin.
                        </p>

                        {availableCars.length === 0 ? (
                            <p className="text-red-500 text-center py-4">Bu grup için müsait araç bulunmuyor.</p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {availableCars.map(car => (
                                    <div
                                        key={car.id}
                                        onClick={() => setSelectedCarId(car.id)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            selectedCarId === car.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">{car.plate_number}</p>
                                                <p className="text-sm text-gray-500">Yıl: {car.exact_year} | KM: {car.current_km?.toLocaleString()}</p>
                                            </div>
                                            {selectedCarId === car.id && (
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setCarSelectModal(null);
                                    setSelectedCarId(null);
                                    setAvailableCars([]);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleStartRental}
                                disabled={!selectedCarId}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                    selectedCarId
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Kiralamayı Başlat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Rezervasyon Görev Yöneticisi</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1: Late Returns (Priority) */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                Geciken Dönüşler ({late.length})
                            </h2>
                            <div className="space-y-3 md:max-h-[70vh] md:overflow-y-auto pr-2 custom-scrollbar">
                                {late.length > 0 ? (
                                    late.map(res => (
                                        <ReservationCard key={res.id} reservation={res} type="late" />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4 text-sm">Geciken rezervasyon yok.</p>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Upcoming */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                Gelecek Rezervasyonlar ({upcoming.length})
                            </h2>
                            <div className="space-y-3 md:max-h-[70vh] md:overflow-y-auto pr-2 custom-scrollbar">
                                {upcoming.length > 0 ? (
                                    upcoming.map(res => (
                                        <ReservationCard key={res.id} reservation={res} type="upcoming" />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4 text-sm">Gelecek rezervasyon yok.</p>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Active */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                Aktif Kiralamalar ({active.length})
                            </h2>
                            <div className="space-y-3 md:max-h-[70vh] md:overflow-y-auto pr-2 custom-scrollbar">
                                {active.length > 0 ? (
                                    active.map(res => (
                                        <ReservationCard key={res.id} reservation={res} type="active" />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4 text-sm">Aktif rezervasyon yok.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}

