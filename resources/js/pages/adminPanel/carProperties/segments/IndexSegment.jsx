import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import SegmentFormModal from "../../../../components/adminPanel/segments/SegmentFormModal.jsx";
import {useTranslation} from "react-i18next";
export default function IndexSegment({segment, lngs, translations}){
    const {t} =  useTranslation();
    return(
        <div className={`w-full`}>
            <Navbar>
                <div className={`w-[50]% `}>
                    <h4>{t("adminpanel.update_segment.update_segment")}</h4><hr /><br />
                    <SegmentFormModal lngs={lngs} segment={segment} translations={translations} mode={"update"}/>
                </div>
            </Navbar>
        </div>
    );
}
