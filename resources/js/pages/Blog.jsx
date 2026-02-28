import {router} from '@inertiajs/react';
import Navbar from '../components/websites/Navbar.jsx';
import {useTranslation} from "react-i18next";
import {Meta} from "react-router-dom";
import MetaData from "../components/websites/MetaData.jsx";

export default function Blog({blogs = []}) {
    console.log(blogs);
    const {t, i18n} = useTranslation();
    const handleNavigation = (slug) => {
        router.visit(`/${i18n.language}/${t('address.blog')}/${slug?.[i18n.language]}`);
    };
    return (
        <>
            <MetaData/>
            <div className="min-h-screen bg-gray-50 w-full">
                <Navbar/>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">
                        Blog
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                        {blogs.map((blog) => {
                            return (
                                <div
                                    key={blog.id}
                                    onClick={() => handleNavigation(blog.slug)}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group"
                                >
                                    <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                                        {blog.cover_photo_path ? (
                                            <img
                                                src={`/storage/${blog.cover_photo_path}`}
                                                alt={blog.title?.[i18n.language]}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 font-medium">Görsel Yok</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex p-4 items-center justify-between`}>
                                        <div className={`bg-orange-600 rounded-lg px-2 text-white`}>kategori</div>
                                        <div
                                            className={`font-semibold`}>{new Date(blog.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="p-5 md:p-6 flex flex-col grow justify-between">
                                        <h2 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors duration-300">
                                            {blog.title?.[i18n.language]}
                                        </h2>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {blogs.length === 0 && (
                        <div className="w-full text-center py-16 md:py-24">
                            <p className="text-gray-500 text-lg md:text-xl font-medium">
                                Henüz blog yazısı bulunmuyor.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
