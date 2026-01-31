import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/websites/Navbar.jsx';
import { MapPin, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function GuestReservationDetails({ reservation: initialReservation }) {
    const { t, i18n } = useTranslation();
    const [reservation, setReservation] = useState(initialReservation);
    console.log(reservation);
    const [processing, setProcessing] = useState(false);

    const handleCancel = () => {
        if (confirm(t('website.reservation_details.confirm_cancel'))) {
            setProcessing(true);
            axios.post(`/guest-reservation/${reservation.id}/cancel`, {
                email: reservation.email,
                lang: i18n.language
            })
            .then(response => {
                 setReservation(prev => ({ ...prev, status: 'cancelled' }));
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while cancelling the reservation.');
            })
            .finally(() => {
                setProcessing(false);
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            case 'completed': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        return t(`website.reservation_details.status.${status}`) || status;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(i18n.language, options);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={t('website.reservation_details.title', { id: reservation.reference_code })} />
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <Link
                    href={`/${i18n.language}/${t('address.checkReservation')}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    {t('website.reservation_details.back_to_search')}
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-gray-800 text-white p-6 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">{t('website.reservation_details.title', { id: reservation.reference_code })}</h1>
                            <p className="text-gray-300 text-sm">{t('website.reservation_details.created_on', { date: formatDate(reservation.created_at) })}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                        </span>
                    </div>

                    <div className="p-6">
                        {/* Car Details Info Block */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="w-full md:w-1/3">
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 mb-4">
                                     {reservation.car.photos && reservation.car.photos.length > 0 ? (
                                        <img
                                            src={`/storage/${reservation.car.photos[0].photo_path}`}
                                            alt={reservation.car.brandKey?.key + ' ' + reservation.car.modelKey?.key}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center p-8 text-gray-400">No Image</div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 text-center">
                                    {reservation.car.brandKey?.key} {reservation.car.modelKey?.key}
                                </h3>
                            </div>

                            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="flex items-center text-gray-500 font-semibold mb-2">
                                            <MapPin size={18} className="mr-2" /> {t('website.reservation_details.pickup')}
                                        </h4>
                                        <p className="font-bold text-gray-800">{reservation.pickup_location?.name}</p>
                                        <p className="text-sm text-gray-600">{formatDate(reservation.pickup_datetime)}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="flex items-center text-gray-500 font-semibold mb-2">
                                            <MapPin size={18} className="mr-2" /> {t('website.reservation_details.return')}
                                        </h4>
                                        <p className="font-bold text-gray-800">{reservation.return_location?.name}</p>
                                        <p className="text-sm text-gray-600">{formatDate(reservation.return_datetime)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="flex items-center text-gray-500 font-semibold mb-2">
                                            <CreditCard size={18} className="mr-2" /> {t('website.reservation_details.payment')}
                                        </h4>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-600 text-sm">{t('website.reservation_details.total_price')}</span>
                                            <span className="font-bold text-xl text-blue-700">
                                                {((reservation.total_price * reservation.exchange_rate).toFixed(2))} {reservation.currency?.symbol}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">{t('website.reservation_details.method')}</span>
                                            <span className="font-medium capitalize">{reservation.payment_type.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                            <span className="text-gray-600 text-sm">{t('website.reservation_details.payment_status')}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                reservation.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {reservation.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="flex items-center text-gray-500 font-semibold mb-2">
                                            <Clock size={18} className="mr-2" /> {t('website.reservation_details.duration')}
                                        </h4>
                                        <p className="font-bold text-gray-800">{reservation.rental_days} {t('website.reservation_details.days')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="border-t border-gray-100 pt-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('website.reservation_details.customer_info')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500">{t('website.reservation_details.full_name')}</span>
                                    <span className="font-medium">{reservation.name} {reservation.surname}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">{t('website.reservation_details.email')}</span>
                                    <span className="font-medium">{reservation.email}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">{t('website.reservation_details.phone')}</span>
                                    <span className="font-medium">{reservation.phone_number}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {reservation.status === 'pending' && (
                            <div className="border-t border-gray-100 pt-6 flex justify-end">
                                <button
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-lg border border-red-200 transition duration-150 flex items-center"
                                >
                                    <XCircle size={18} className="mr-2" />
                                    {processing ? t('website.reservation_details.cancelling') : t('website.reservation_details.cancel_button')}
                                </button>
                            </div>
                        )}

                        {reservation.status === 'cancelled' && (
                             <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
                                <AlertCircle size={20} className="mr-2" />
                                {t('website.reservation_details.cancelled_alert')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
