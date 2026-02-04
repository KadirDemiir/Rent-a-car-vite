import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { useState } from "react";
import ExternalServiceModal from "../../../components/adminPanel/price/ExternalServiceModal.jsx";
import {useTranslation} from "react-i18next";
import {useCurrency} from "../../../providers/CurrencyContext.jsx";
import { Plus, Package, Edit2 } from "lucide-react";

export default function ExtraServices({ extraServices, success, error }) {
    const {t, i18n} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instantService, setInstantService] = useState(null);
    const {calculateTotal, current} = useCurrency();

    const handleService = (id) => {
        const selected = extraServices.find((es) => es.id === id);
        setInstantService(selected);
        setIsModalOpen(true);
    };

    const createService = () => {
        setInstantService(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setInstantService(null);
    };

    const getPrice = (es, minDays, maxDays) => {
        const price = es.extra_service_prices?.find(e => e.min_days === minDays && e.max_days === maxDays);
        return price ? Number(calculateTotal(price.base_price)).toFixed(2) : '-';
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {t("adminpanel.pricing.adding_services.external_services.external_services")}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                {t("adminpanel.pricing.adding_services.external_services.manage_services", "Manage your additional services and pricing")}
                            </p>
                        </div>
                        <button
                            onClick={createService}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">{t("adminpanel.pricing.adding_services.external_services.button.add_new_service")}</span>
                            <span className="sm:hidden">{t("add", "Add")}</span>
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                            <span className="text-sm font-medium">{success}</span>
                        </div>
                    )}

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {t("adminpanel.pricing.adding_services.external_services.service")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            1-3 {t("days", "Days")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            4-7 {t("days", "Days")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            8-15 {t("days", "Days")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            16+ {t("days", "Days")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {t("adminpanel.pricing.adding_services.external_services.stock")}
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {t("adminpanel.pricing.adding_services.external_services.current_stock")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {t("adminpanel.pricing.adding_services.external_services.description")}
                                        </th>
                                        <th className="px-4 py-4 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {extraServices.map((es) => {
                                        const name = JSON.parse(es.name);
                                        const description = JSON.parse(es.description);
                                        return (
                                            <tr 
                                                key={es.id} 
                                                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                onClick={() => handleService(es.id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Package size={20} className="text-blue-600" />
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{name[i18n.language]}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="font-medium text-gray-900">{getPrice(es, 1, 3)}</span>
                                                    <span className="text-gray-500 text-xs ml-1">{current?.symbol}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="font-medium text-gray-900">{getPrice(es, 4, 7)}</span>
                                                    <span className="text-gray-500 text-xs ml-1">{current?.symbol}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="font-medium text-gray-900">{getPrice(es, 8, 15)}</span>
                                                    <span className="text-gray-500 text-xs ml-1">{current?.symbol}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="font-medium text-gray-900">{getPrice(es, 16, 999)}</span>
                                                    <span className="text-gray-500 text-xs ml-1">{current?.symbol}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {es.stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        es.current_stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {es.current_stock ?? "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {description[i18n.language]}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {extraServices.length === 0 && (
                            <div className="text-center py-12">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">{t("adminpanel.pricing.adding_services.external_services.no_services", "No services added yet")}</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-4">
                        {extraServices.map((es) => {
                            const name = JSON.parse(es.name);
                            const description = JSON.parse(es.description);
                            return (
                                <div 
                                    key={es.id}
                                    onClick={() => handleService(es.id)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{name[i18n.language]}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1">{description[i18n.language]}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>

                                    {/* Price Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-500 mb-1">1-3 {t("days", "Days")}</p>
                                            <p className="font-semibold text-gray-900">{getPrice(es, 1, 3)} {current?.symbol}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-500 mb-1">4-7 {t("days", "Days")}</p>
                                            <p className="font-semibold text-gray-900">{getPrice(es, 4, 7)} {current?.symbol}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-500 mb-1">8-15 {t("days", "Days")}</p>
                                            <p className="font-semibold text-gray-900">{getPrice(es, 8, 15)} {current?.symbol}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-500 mb-1">16+ {t("days", "Days")}</p>
                                            <p className="font-semibold text-gray-900">{getPrice(es, 16, 999)} {current?.symbol}</p>
                                        </div>
                                    </div>

                                    {/* Stock Info */}
                                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{t("adminpanel.pricing.adding_services.external_services.stock")}:</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {es.stock}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{t("adminpanel.pricing.adding_services.external_services.current_stock")}:</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                es.current_stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {es.current_stock ?? "-"}
                                            </span>
                                        </div>
                                        {es.max_limit && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{t("adminpanel.pricing.adding_services.external_services.max_limit")}:</span>
                                                <span className="text-xs font-medium text-gray-700">{es.max_limit}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {extraServices.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">{t("adminpanel.pricing.adding_services.external_services.no_services", "No services added yet")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Navbar>

            {isModalOpen && (
                <ExternalServiceModal service={instantService} close={closeModal} />
            )}
        </div>
    );
}
