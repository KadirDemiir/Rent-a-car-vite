import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import { useTranslation } from "react-i18next";
import BodyTypeForm from "../../../../components/adminPanel/carProperties/BodyTypeForm.jsx";

export default function AddBodyType({ lngs }) {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <Navbar >
                <h4>{t("adminpanel.add_body_type.add_body_type")}</h4><hr /><br />
                <BodyTypeForm lngs={lngs}/>
            </Navbar>
        </div>
    );
}
