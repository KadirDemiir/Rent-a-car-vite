import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Sparkles, ChevronRight } from "lucide-react";

export default function BlogTitlePreview() {
    const { i18n } = useTranslation();
    const [blogTitles, setBlogTitles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogTitles = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/get-blog-titles');

                if (response.status === 200 && response.data?.blog_titles) {
                    setBlogTitles(response.data.blog_titles);
                }
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchBlogTitles();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[250px] w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blogTitles || blogTitles.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-8 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all">
            <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 flex items-center gap-2.5 border-b border-gray-100">
                <Sparkles className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                    İlginizi Çekebilir
                </h3>
            </div>

            <div className="flex flex-col w-full">
                <ul className="flex flex-col w-full">
                    {blogTitles.slice(0, 5).map((item, index) => {
                        const rawTitle = item?.title !== undefined ? item.title : item;
                        const t = typeof rawTitle === 'string' ? JSON.parse(rawTitle) : rawTitle;

                        return (
                            <li
                                key={index}
                                className="group w-full px-5 py-4 hover:bg-blue-50/60 transition-all flex items-start gap-3 border-b border-solid border-gray-100 last:border-b-0 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-red-600 transition-colors shrink-0 mt-0.5" />
                                <span className="text-gray-600 group-hover:text-red-600 font-medium text-sm sm:text-base line-clamp-2 transition-colors">
                                    {t?.[i18n.language]}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
