import { useTranslation } from "react-i18next";
import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import SegmentFormModal from "../../../../components/adminPanel/segments/SegmentFormModal.jsx";
export default function AddSegment({ lngs }) {
    console.log(lngs);
    const { t } = useTranslation();
    return (
        <div className="w-full">
            <Navbar >
                <h4>{t("adminpanel.segments.add_segment.add_segment")}</h4><hr /><br />
                < SegmentFormModal lngs={lngs} segment={null} translations={null}/>
            </Navbar>
        </div>
    );
}
