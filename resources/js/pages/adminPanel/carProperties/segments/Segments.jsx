import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import {Link, router} from "@inertiajs/react";

export default function Segments({segments}){
    const {i18n, t} = useTranslation();

    const visitHandler = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.segments")}/${id}`, { method: 'get' })
    };

    const renderStatusBadge = (isActive) => {
        return (
            <div className="flex items-center gap-2 w-fit">
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
                    {isActive ? t("adminpanel.segments.status.active") : t("adminpanel.segments .status.pasive")}
                </span>
            </div>
        );
    };

    return(
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {t("adminpanel.segments.segments")}
                            </h1>
                        </div>
                        <Link 
                            href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.segments")}/${t("address.add")}`}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <span>+</span>
                            {t("adminpanel.segments.button.add_new")}
                        </Link>
                    </div>
                    <hr className="border-gray-200" />
                </div>

                {/* Empty State */}
                {!segments || segments.length === 0 ? (
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
                                            {t("adminpanel.segments.segment_id")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.segments.segment_name")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.segments.status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {segments?.map(segment => (
                                        <tr 
                                            key={segment.id}
                                            onClick={() => visitHandler(segment.id)}
                                            className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{segment.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {t(`segment.${segment.id}`)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {renderStatusBadge(segment.is_active)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">{segments.length}</span>
                            </p>
                        </div>
                    </div>
                )}
            </Navbar>
        </div>
    );
}
