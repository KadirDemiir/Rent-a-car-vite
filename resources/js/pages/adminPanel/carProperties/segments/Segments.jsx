import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import Td from "../../../../components/adminPanel/table/Td.jsx";
import {Link, router} from "@inertiajs/react";
import {useEffect, useState} from "react";

export default function Segments({segments}){
    const {i18n, t} = useTranslation();

    const visitHandler = (id) => {
        router.visit(`/adminpanel/segments/${id}`, { method: 'get' })
    };
    return(
        <div className={`w-full`}>
            <Navbar>
                <h4>{t("adminpanel.segments.segments")}</h4><hr/><br/>
                <table className={`w-full border-bottom`}>
                    <thead>
                    <tr className={`font-bold`}>
                        <Td contents={[
                            t("adminpanel.segments.segment_id"),
                            t("adminpanel.segments.segment_name"),
                            t("adminpanel.segments.status")
                        ]} />
                    </tr>
                    </thead>
                    <tbody>
                    {segments?.map(segment => (
                        <tr key={segment.id} onClick={() => visitHandler(segment.id)} className={`cursor-pointer`}>
                            <Td contents={[segment.id, t(`segment.${segment.id}`), segment.is_active? <span className={`text-green-600`}>{t("adminpanel.segments.status.active")}</span> : <span className={`text-red-600`}>{t("adminpanel.segments .status.pasive")}</span>]}/>
                        </tr>
                    ))}
                    </tbody>
                </table><br/><br/>
                <div className={`w-full flex items-center justify-end`}>
                    <Link href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.segments")}/${t("address.add")}`} className={`py-1 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl`}>{t("adminpanel.segments.button.add_new")}</Link>
                </div>
            </Navbar>
        </div>
    )
}
