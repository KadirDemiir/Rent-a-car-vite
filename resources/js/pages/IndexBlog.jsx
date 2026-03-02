import Navbar from "../components/websites/Navbar.jsx";
import MetaData from "../components/websites/MetaData.jsx";
import {useTranslation} from "react-i18next";
import {Link} from '@inertiajs/react';
import BlogTitlePreview from "../components/websites/blog/BlogTitlePreview.jsx";

export default function IndexBlog({blog}) {
    const {t, i18n} = useTranslation();

    return (
        <>
            <MetaData/>
            <div className="min-h-screen bg-white">
                <Navbar/>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                        <main className="w-full lg:w-[70%] flex flex-col gap-8">
                            <p>
                                <Link href={`/${i18n.language}/${t('address.blog')}`} className={`font-semibold text-gray-600 hover:text-blue-700`}>{t('website.navigator.blog')}</Link>
                                <span className={`font-semibold text-gray-600`}> / {blog?.title?.[i18n.language]}</span>
                            </p>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                {blog?.title?.[i18n.language]}
                            </h1>

                            {blog?.cover_photo_path && (
                                <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={`/storage/${blog.cover_photo_path}`}
                                        alt={blog?.title?.[i18n.language]}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </div>
                            )}

                            <article
                                className="campaign-content wysiwyg-content wrap-break-words"
                                dangerouslySetInnerHTML={{__html:  blog?.content?.[i18n.language]}}
                            />
                        </main>

                        <aside className="w-full lg:w-[30%]">
                                <BlogTitlePreview />
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}
