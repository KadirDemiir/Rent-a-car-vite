import Navbar from "../components/websites/Navbar.jsx";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="bg-red-50 p-4 rounded-full border border-red-100">
                            <AlertCircle className="h-16 w-16 text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-7xl sm:text-9xl font-extrabold text-gray-900 tracking-tight">
                            404
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            {t('page_not_found', 'Sayfa Bulunamadı')}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-500">
                            {t('page_not_found_desc', 'Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {t('go_back', 'Geri Dön')}
                        </button>

                        <Link
                            href="/"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Home className="w-5 h-5" />
                            {t('go_home', 'Ana Sayfaya Dön')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
