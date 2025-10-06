import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import FuelTypeForm from "../../../../components/adminPanel/carProperties/FuelTypeForm.jsx";
import TransmissionTypeForm from "../../../../components/adminPanel/carProperties/TransmissionTypeForm.jsx";
import {useTranslation} from "react-i18next";

export default function IndexTransmission({languages, transmission}){
    const {t} = useTranslation();
    return(
        <div className={`w-full`}>
            <Navbar >
                <h4>{t("adminpanel.update_transmission.update_transmission")}</h4><hr/><br/>
                <h5></h5>
                <TransmissionTypeForm lngs={languages} transmission={transmission} mode='update'/>
            </Navbar>
        </div>
    );
}
