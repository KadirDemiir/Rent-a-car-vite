import Navbar from "../components/websites/Navbar.jsx";
import MetaData from "../components/websites/MetaData.jsx";

export default function IndexBlog({blog}) {
    const getLocalizedValue = (value) => {
        if (!value) return '';
        if (typeof value === 'object') {
            return value[Object.keys(value)[0]];
        }
        try {
            const parsed = JSON.parse(value);
            return parsed[Object.keys(parsed)[0]];
        } catch (e) {
            return value;
        }
    };

    const displayTitle = getLocalizedValue(blog?.title);
    const displayContent = getLocalizedValue(blog?.content);

    return (
        <>
            <MetaData/>
            <div className="min-h-screen bg-white">
                <Navbar/>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                        <main className="w-full lg:w-[70%] flex flex-col gap-8">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                {displayTitle}
                            </h1>

                            {blog?.cover_photo_path && (
                                <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={`/storage/${blog.cover_photo_path}`}
                                        alt={displayTitle}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </div>
                            )}

                            <article
                                className="campaign-content wysiwyg-content wrap-break-words"
                                dangerouslySetInnerHTML={{__html: displayContent}}
                            />
                        </main>

                        <aside className="w-full lg:w-[30%]">
                            <div
                                className="sticky top-8 w-full min-h-[400px] bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-gray-400">
                                Sağ Panel (Sonradan Eklenecek Alan)
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}
