import React, { useState } from 'react';
import NavBar from '../../components/websites/Navbar.jsx';
import { usePage, useForm, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function MyReservations({ reservations }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const { patch, processing } = useForm();
    const [filter, setFilter] = useState('active'); // 'active' or 'past'

    const handleCancel = (id) => {
        if (confirm(t('Are you sure you want to cancel this reservation?'))) {
            patch(`/my-reservations/${id}/cancel`);
        }
    };

    const activeReservations = reservations.filter(r => ['pending', 'confirmed'].includes(r.status));
    const pastReservations = reservations.filter(r => ['cancelled', 'completed', 'failed'].includes(r.status));

    const displayedReservations = filter === 'active' ? activeReservations : pastReservations;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Head title={t('My Reservations')} />
            <NavBar />
            
            <div className="container mx-auto px-4 py-8 mt-5">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('My Reservations')}</h1>

                {flash && flash.success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p>{flash.success}</p>
                    </div>
                )}
                {flash && flash.error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p>{flash.error}</p>
                    </div>
                )}

                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${filter === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setFilter('active')}
                    >
                        {t('Active Reservations')}
                    </button>
                    <button 
                        className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${filter === 'past' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setFilter('past')}
                    >
                        {t('Past Reservations')}
                    </button>
                </div>

                <div className="space-y-6">
                    {displayedReservations.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg">{t('No reservations found.')}</p>
                        </div>
                    ) : (
                        displayedReservations.map(reservation => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <div className="p-6 md:flex gap-6">
                                    {reservation.car?.photos && reservation.car.photos.length > 0 && (
                                        <div className="w-full md:w-48 h-32 flex-shrink-0 mb-4 md:mb-0 bg-gray-100 rounded-md overflow-hidden text-center">
                                             <img 
                                                src={`/storage/${reservation.car.photos[0].image_path}`} 
                                                alt="Car" 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => {e.target.onerror = null; e.target.src = '/placeholder.png'}} 
                                             />
                                        </div>
                                    )}

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                 <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2
                                                    ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                      reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                      'bg-gray-100 text-gray-800'}`}>
                                                    {t(reservation.status.toUpperCase())}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {reservation.car?.brand_key?.brand} {reservation.car?.model_key?.model}
                                                </h3>
                                                <p className="text-gray-500 text-sm">#{reservation.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {parseFloat(reservation.total_price).toFixed(2)} {reservation.currency?.symbol || reservation.currency?.code}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-1">{t('Pick-up')}</p>
                                                <p>{formatDate(reservation.pickup_datetime)}</p>
                                                <p>{reservation.pickup_location?.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-1">{t('Return')}</p>
                                                <p>{formatDate(reservation.return_datetime)}</p>
                                                <p>{reservation.return_location?.name}</p>
                                            </div>
                                        </div>

                                        {reservation.status === 'pending' && (
                                            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
                                                <button 
                                                    onClick={() => handleCancel(reservation.id)}
                                                    disabled={processing}
                                                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                                >
                                                    {processing ? t('Cancelling...') : t('Cancel Reservation')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
