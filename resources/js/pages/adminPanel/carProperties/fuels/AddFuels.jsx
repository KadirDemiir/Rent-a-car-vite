import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import FuelTypeForm from "../../../../components/adminPanel/carProperties/FuelTypeForm.jsx";

export default function AddBodyType({lngs}){
    const { t } = useTranslation();

    return(
        <div className="w-full">
            <Navbar >
                <h4>{t("adminpanel.add_fuel.add_fuel")}</h4><hr /><br />
                <FuelTypeForm lngs={lngs}/>
            </Navbar>
        </div>
    );
}
