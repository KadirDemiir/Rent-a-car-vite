import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function BodyTypes({types}){
    const {i18n, t} = useTranslation();

    const handleVisit = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.body_types")}/${id}`);
    }

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
                    {isActive ? t("adminpanel.body_types.status.active") : t("adminpanel.body_types.status.pasive")}
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
                                {t("adminpanel.body_types.body_types")}
                            </h1>
                        </div>
                        <Link 
                            href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.body_types")}/${t("address.add")}`}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <span>+</span>
                            {t("adminpanel.body_types.button.add_new")}
                        </Link>
                    </div>
                    <hr className="border-gray-200" />
                </div>

                {/* Empty State */}
                {!types || types.length === 0 ? (
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
                                            {t("adminpanel.body_types.body_type_id")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.body_types.body_types_name")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            {t("adminpanel.body_types.status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {types?.map(bt => (
                                        <tr 
                                            key={bt.id}
                                            onClick={() => handleVisit(bt.id)}
                                            className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{bt.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {t(`body_type.${bt.id}`)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {renderStatusBadge(bt.is_active)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">{types.length}</span>
                            </p>
                        </div>
                    </div>
                )}
            </Navbar>
        </div>
    );
}
