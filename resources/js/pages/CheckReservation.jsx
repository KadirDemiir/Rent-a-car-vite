import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/websites/Navbar.jsx';

export default function CheckReservation() {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        reservation_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/${i18n.language}/${t('address.checkReservation')}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={t('website.check_reservation.title')} />
            <NavBar />
            
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('website.check_reservation.title')}</h1>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {t('website.check_reservation.email_label')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('website.check_reservation.email_placeholder')}
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reservation_id">
                                {t('website.check_reservation.id_label')} (Numeric)
                            </label>
                            <input
                                id="reservation_id"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={data.reservation_id}
                                onChange={(e) => setData('reservation_id', e.target.value)}
                                placeholder={t('website.check_reservation.id_placeholder')}
                            />
                            {errors.reservation_id && <div className="text-red-500 text-sm mt-1">{errors.reservation_id}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition duration-150"
                        >
                            {processing ? t('website.check_reservation.button_checking') : t('website.check_reservation.button_check')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
