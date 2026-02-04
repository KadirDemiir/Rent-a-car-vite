import { useTranslation } from 'react-i18next';
import Navbar from '../../components/adminPanel/navbar/Navbar.jsx';
import { useState, useEffect } from 'react';
import Confirm from '../../components/Confirm.jsx';
import axios from 'axios';

export default function Home({ upcomingReservations, activeReservations, lateReservations }) {
    const {t} = useTranslation();
    const [confirmModal, setConfirmModal] = useState(null);

    const [upcoming, setUpcoming] = useState(upcomingReservations);
    const [active, setActive] = useState(activeReservations);
    const [late, setLate] = useState(lateReservations);

    useEffect(() => {
        setUpcoming(upcomingReservations);
        setActive(activeReservations);
        setLate(lateReservations);
    }, [upcomingReservations, activeReservations, lateReservations]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('tr-TR', { 
            day: 'numeric', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    const handleCardClick = (reservation, type) => {
        if (type === 'upcoming') {
            setConfirmModal({
                message: 'Aracı teslim etmek (kiralamayı başlatmak) istiyor musunuz?',
                onConfirm: () => {
                    axios.post(`/adminpanel/reservations/${reservation.id}/start`)
                        .then(() => {
                            setConfirmModal(null);
                            setUpcoming(prev => prev.filter(r => r.id !== reservation.id));
                            setActive(prev => [...prev, { ...reservation, status: 'active' }]); 
                        })
                        .catch(() => {
                            setConfirmModal(null);
                        });
                }
            });
        } else if (type === 'active' || type === 'late') {
            setConfirmModal({
                message: 'Aracı teslim almak (kiralamayı tamamlamak) istiyor musunuz?',
                onConfirm: () => {
                    axios.post(`/adminpanel/reservations/${reservation.id}/complete`)
                        .then(() => {
                            setConfirmModal(null);
                            if (type === 'active') {
                                setActive(prev => prev.filter(r => r.id !== reservation.id));
                            } else {
                                setLate(prev => prev.filter(r => r.id !== reservation.id));
                            }
                        })
                        .catch(() => {
                            setConfirmModal(null);
                        });
                }
            });
        }
    };

    const ReservationCard = ({ reservation, type }) => {
        const isLate = type === 'late';
        const borderColor = isLate ? 'border-red-500' : (type === 'active' ? 'border-green-500' : 'border-gray-500');
        const badgeColor = isLate ? 'bg-red-100 text-red-800' : (type === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800');

        return (
            <div 
                onClick={() => handleCardClick(reservation, type)}
                className={`bg-white p-4 rounded-lg shadow border-l-4 ${borderColor} mb-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800">
                            {t(reservation.car?.brand_key?.key) || ''} {t(reservation.car?.model_key?.key) || ''} {reservation.car?.year || ''} {t(`fuel.${reservation.car.fuel_id}`)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            {reservation.car?.license_plate}
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

