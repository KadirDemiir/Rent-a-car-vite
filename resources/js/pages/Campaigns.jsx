import CampaignsCard from '../components/websites/campaignsCard/CampaignsCard.jsx';
import Navbar from '../components/websites/Navbar.jsx';
export default function Campaigns() {
    return (
        <div>
            < Navbar />
            <div className="p-4 w-full flex justify-center bg-gray-100">
                <div className="w-[90%]">
                    < CampaignsCard />
                </div>
            </div>
        </div>
    );
}
