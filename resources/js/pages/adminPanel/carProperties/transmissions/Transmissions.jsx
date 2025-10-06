import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../../components/adminPanel/table/Td.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function Transmissions({transmissions}){
    const {i18n, t} = useTranslation();
    const handleVisit = (id) => {
        router.visit(`/adminpanel/transmissions/${id}`, {method: 'get'});
    }
    return(
        <div className={`w-full`}>
            <Navbar >
                <h4>{t("adminpanel.transmissions.transmissions")}</h4><hr/><br/>
                <table className={`w-full border-bottom`}>
                    <thead>
                    <tr className={`font-bold`}>
                        <Td contents={[
                            t("adminpanel.transmissions.transmission_id"),
                            t("adminpanel.transmissions.transmission_name"),
                            t("adminpanel.transmissions.status")
                        ]} />
                    </tr>
                    </thead>
                    <tbody>
                    {transmissions?.map(transmission => (
                        <tr key={transmission.id} onClick={() => handleVisit(transmission.id)} className={`cursor-pointer`}>
                            <Td contents={[transmission.id, t(`transmission.${transmission.id}`), transmission.is_active ? <span className={`text-green-600`}>{t("adminpanel.transmissions.status.active")}</span> : <span className={`text-red-600`}>{t("adminpanel.transmissions.status.pasive")}</span>]}/>
                        </tr>
                    ))}
                    </tbody>
                </table><br/><br/>
                <div className={`w-full flex items-center justify-end`}>
                    <Link href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.transmissions")}/${t("address.add")}`} className={`py-1 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl`}>{t("adminpanel.transmissions.button.add_new")}</Link>
                </div>
            </Navbar>
        </div>
    );
}
