import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import CampaignsCards from "../../../components/websites/campaignsCard/CampaignsCards.jsx";
import SuccessMessage from "../../../components/SuccessMessage.jsx";

export default function Campaigns({campaigns, success}){
    //const { i18n } = useTranslation();
    const currentLang = "tr";
    return(
        <div>
            < Navbar >
                <div className="flex flex-col justify-center bg-gray-100">
                    <SuccessMessage message={success} />

                    <div className="w-[90%]">
                        < CampaignsCards campaigns={campaigns} isAdmin={true}/>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}


