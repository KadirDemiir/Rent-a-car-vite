import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../../components/adminPanel/table/Td.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function BodyTypes({types}){
    const {i18n, t} = useTranslation();

    const handleVisit = (id) => {
        router.visit(`/adminpanel/body_types/${id}`);
    }
    return(
        <div className={`w-full`}>
            <Navbar>
                <h4>{t("adminpanel.body_types.body_types")}</h4><hr/><br/>
                <table className={`w-full border-bottom`}>
                    <thead>
                    <tr className={`font-bold`}>
                        <Td contents={[
                            t("adminpanel.body_types.body_type_id"),
                            t("adminpanel.body_types.body_types_name"),
                            t("adminpanel.body_types.status")
                        ]} />
                    </tr>
                    </thead>
                    <tbody>
                    {types?.map(bt => (
                        <tr key={bt.id} onClick={() => handleVisit(bt.id)} className={`cursor-pointer`}>
                            <Td contents={[bt.id, t(`body_type.${bt.id}`), bt.is_active? <span className={`text-green-600`}>{t("adminpanel.body_types.status.active")}</span> : <span className={`text-red-600`}>{t("adminpanel.body_types.status.pasive")}</span>]}/>
                        </tr>
                    ))}
                    </tbody>
                </table><br/><br/>
                <div className={`w-full flex items-center justify-end`}>
                    <Link href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.body_types")}/${t("address.add")}`} className={`py-1 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl`}>{t("adminpanel.body_types.button.add_new")}</Link>
                </div>
            </Navbar>
        </div>
    );
}
