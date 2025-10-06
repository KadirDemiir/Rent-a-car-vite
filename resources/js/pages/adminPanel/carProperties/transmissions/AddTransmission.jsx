import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import TransmissionTypeForm from "../../../../components/adminPanel/carProperties/TransmissionTypeForm.jsx";
export default function AddBodyType({lngs}){
    const { t } = useTranslation();

    return(
        <div className="w-full">
            <Navbar >
                <h4>{t("adminpanel.add_transmission.add_transmission")}</h4><hr /><br />
                <TransmissionTypeForm lngs={lngs}/>
            </Navbar>
        </div>

    );
}
