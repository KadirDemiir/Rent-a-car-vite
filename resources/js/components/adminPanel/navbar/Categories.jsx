import {Link, usePage} from "@inertiajs/react";

export default function Categories({clickHandle, index, isOpenSection, menuSection}) {
    const { url } = usePage();
    const currentPath = url.toLowerCase().replace(/\s+/g, '');

    return (
        <li className="w-full mb-2">
            <div
                onClick={() => clickHandle(index)}
                className="w-full h-10 flex items-center justify-start gap-4 px-4 rounded-2xl hover:bg-gray-800 cursor-pointer bg-gray-700"
            >
                <span className="text-xl">{isOpenSection ? '−' : '+'}</span>
                <span>{menuSection.title}</span>
            </div>

            {isOpenSection && (
                <ul className="ml-8 mt-2 text-sm text-white space-y-2">
                    {(() => {
                        const firstMatchingSection = menuSection.subSec.find((sec) => {
                            const hrefNormalized = sec.href.toLowerCase().replace(/\s+/g, '');
                            return currentPath === hrefNormalized || currentPath.startsWith(`${hrefNormalized}/`);
                        });
                        return menuSection.subSec.map((sec) => {
                            const isActive = firstMatchingSection === sec;

                            return (
                                <li key={sec.name}>
                                    <Link
                                        href={sec.href}
                                        preserveState={true}
                                        preserveScroll={true}
                                        className={`block cursor-pointer px-2 py-1 rounded-2xl hover:underline ${
                                            isActive ? "bg-red-800" : ""
                                        }`}
                                    >
                                        {sec.name}
                                    </Link>
                                </li>
                            );
                        });
                    })()}
                </ul>
            )}
        </li>
    );
}
