import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../../components/adminPanel/table/Td.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function Fuels({fuels}){
    const {i18n, t} = useTranslation();
    const handleVisit = (id) => {
        router.visit(`/adminpanel/fuels/${id}`, {method: 'get'});
    }
    return(
        <div className={`w-full`}>
            <Navbar >
                <h4>{t("adminpanel.fuels.fuels")}</h4><hr/><br/>
                <table className={`w-full border-bottom`}>
                    <thead>
                    <tr className={`font-bold`}>
                        <Td contents={[
                            t("adminpanel.fuels.fuel_id"),
                            t("adminpanel.fuels.fuel_name"),
                            t("adminpanel.fuels.status")
                        ]} />
                    </tr>
                    </thead>
                    <tbody>
                    {fuels?.map(fuel => (
                        <tr key={fuel.id} onClick={() => handleVisit(fuel.id)} className={`cursor-pointer`}>
                            <Td contents={[fuel.id, t(`fuel.${fuel.id}`), fuel.is_active? <span className={`text-green-600`}>{t("adminpanel.fuels.status.active")}</span> : <span className={`text-red-600`}>{t("adminpanel.fuels.status.pasive")}</span>]}/>
                        </tr>
                    ))}
                    </tbody>
                </table><br/><br/>
                <div className={`w-full flex items-center justify-end`}>
                    <Link href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.fuels")}/${t("address.add")}`} className={`py-1 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl`}>{t("adminpanel.fuels.button.add_new")}</Link>
                </div>
            </Navbar>
        </div>
    );
}
