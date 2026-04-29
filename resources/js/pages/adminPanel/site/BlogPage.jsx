import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { router } from '@inertiajs/react';
import {useTranslation} from "react-i18next";

export default function BlogPage({ blogs }) {
    const {t} = useTranslation();

    const handleRowClick = (id) => {
        router.get(`/${t('address.adminpanel')}/${t('address.blog_page')}/${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const getTitle = (titleData) => {
        if (!titleData) return "-";

        if (typeof titleData === 'string') {
            try {
                const parsed = JSON.parse(titleData);
                return parsed.tr || parsed.en || Object.values(parsed)[0] || "-";
            } catch (e) {
                return titleData;
            }
        }

        return titleData.tr || titleData.en || Object.values(titleData)[0] || "-";
    };

    return (
        <Navbar>
            <div className="w-full p-4">
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse min-w-150">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Başlık</th>
                            <th className="p-4 font-semibold text-gray-700">Durum</th>
                            <th className="p-4 font-semibold text-gray-700">Oluşturulma Tarihi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {blogs && blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <tr
                                    key={blog.id}
                                    onClick={() => handleRowClick(blog.id)}
                                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="p-4 font-medium text-gray-900">
                                        {getTitle(blog.title)}
                                    </td>
                                    <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${blog.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {blog.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {formatDate(blog.created_at)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">
                                    Henüz blog yazısı bulunmuyor.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Navbar>
    );
}
