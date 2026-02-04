import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function Language({languages}){
    const {i18n, t} = useTranslation();
    
    const handleClick = (id) => {
        router.visit(`/${i18n.language}/${t('address.adminpanel')}/${t('address.languages').toLowerCase()}/${id}`, { method: 'get' })
    }

    const renderStatusBadge = (status) => {
        const isActive = status === 'active';
        return (
            <div className={`flex items-center gap-2 w-fit`}>
                <span className={`w-3 h-3 rounded-full ${
                    isActive 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                }`}></span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {status}
                </span>
            </div>
        );
    }

    return(
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {t("adminpanel.languages.languages")}
                            </h1>
                        </div>
                        <Link 
                            href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.languages")}/${t("address.add")}`}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <span>+</span>
                            {t("adminpanel.languages.add_new")}
                        </Link>
                    </div>
                    <hr className="border-gray-200" />
                </div>

                {/* Empty State */}
                {!languages || languages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg"></p>
                    </div>
                ) : (
                    /* Table Section */
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.languages.language_id")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.languages.language_code")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.languages.language_name")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.languages.status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {languages.map((lang) => (
                                        <tr 
                                            key={lang.id}
                                            onClick={() => handleClick(lang.id)}
                                            className="hover:bg-gray-50 transition-colors duration-150 group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{lang.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className="inline-block bg-gray-100 px-3 py-1 rounded font-mono text-xs">
                                                    {lang.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {lang.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {renderStatusBadge(lang.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">{languages.length}</span>
                            </p>
                        </div>
                    </div>
                )}
            </Navbar>
        </div>
    );
}
