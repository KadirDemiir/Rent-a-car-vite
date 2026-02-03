import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../../components/adminPanel/navbar/Navbar.jsx';

export default function ChangePassword() {
    const { t, i18n } = useTranslation();
    const { props } = usePage();
    const success = props?.success;

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const { errors: pageErrors } = usePage().props;
    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/${i18n.language}/${t('address.adminpanel')}/admin`, {
            onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <Navbar>
            <Head title="Change Password" />
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Change Password</h1>
                    <p className="text-gray-500 mb-6">Update your admin account password.</p>

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}
                    {(pageErrors.current_password || pageErrors.password || pageErrors.password_confirmation) && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {pageErrors.current_password || pageErrors.password || pageErrors.password_confirmation}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <input
                                id="current_password"
                                type="password"
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.current_password ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </Navbar>
    );
}
