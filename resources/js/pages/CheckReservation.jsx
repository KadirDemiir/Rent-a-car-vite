import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/websites/Navbar.jsx';

export default function CheckReservation() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        reservation_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/check-reservation');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Check Reservation" />
            <NavBar />
            
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Check Reservation</h1>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reservation_id">
                                Reservation ID (Numeric)
                            </label>
                            <input
                                id="reservation_id"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={data.reservation_id}
                                onChange={(e) => setData('reservation_id', e.target.value)}
                                placeholder="Enter your reservation ID"
                            />
                            {errors.reservation_id && <div className="text-red-500 text-sm mt-1">{errors.reservation_id}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition duration-150"
                        >
                            {processing ? 'Checking...' : 'Check Reservation'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
