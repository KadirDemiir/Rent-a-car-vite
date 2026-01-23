import Navbar from '../../components/adminPanel/navbar/NavBar.jsx';
import { usePage } from '@inertiajs/react';

export default function Home({ upcomingReservations, activeReservations, lateReservations }) {
    
    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('tr-TR', { 
            day: 'numeric', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    const ReservationCard = ({ reservation, type }) => {
        const isLate = type === 'late';
        const borderColor = isLate ? 'border-red-500' : (type === 'active' ? 'border-green-500' : 'border-blue-500');
        const badgeColor = isLate ? 'bg-red-100 text-red-800' : (type === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800');

        return (
            <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${borderColor} mb-3`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800">
                            {reservation.car?.brand_key?.value || 'Bilinmiyor'} {reservation.car?.model_key?.value || ''}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {reservation.name} {reservation.surname}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {reservation.plate_number || reservation.car?.plate_number}
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
            <Navbar>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Rezervasyon Görev Yöneticisi</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1: Late Returns (Priority) */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                Geciken Dönüşler ({lateReservations.length})
                            </h2>
                            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {lateReservations.length > 0 ? (
                                    lateReservations.map(res => (
                                        <ReservationCard key={res.id} reservation={res} type="late" />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4 text-sm">Geciken rezervasyon yok.</p>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Upcoming */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                Gelecek Rezervasyonlar ({upcomingReservations.length})
                            </h2>
                            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {upcomingReservations.length > 0 ? (
                                    upcomingReservations.map(res => (
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
                                Aktif Kiralamalar ({activeReservations.length})
                            </h2>
                            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {activeReservations.length > 0 ? (
                                    activeReservations.map(res => (
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

