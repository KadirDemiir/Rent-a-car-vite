import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useTranslation} from "react-i18next";
import CampaignsCard from "../../../components/websites/campaignsCard/CampaignsCard.jsx";

export default function Campaigns({campaigns, success}){
    //const { i18n } = useTranslation();
    const currentLang = "tr";
    return(
        <div>
            < Navbar />
            <div className="pl-64 pt-24 pr-4 w-full flex flex-col justify-center bg-gray-100">
                {success &&
                    <><div className={`bg-green-400 border-l-8 border-green-700 text-white py-4`}>{success}</div><br/></>
                }

                <div className="w-[90%]">
                    < CampaignsCard campaigns={campaigns} isAdmin={true}/>
                </div>
            </div>
        </div>
    );
}


