import {Head, usePage} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function MetaData(){
    const {i18n} = useTranslation();
    const {pageMeta} = usePage().props;
    return(
        <Head>
            <title>{pageMeta?.meta_title?.[i18n.language]}</title>
            <meta name="description" content={pageMeta?.meta_description?.[i18n.language]} />
            <meta name="keywords" content={pageMeta?.meta_keywords?.[i18n.language]} />
        </Head>
    );
}
