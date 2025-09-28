import CampaignsCards from '../components/websites/campaignsCard/CampaignsCards.jsx';
import Navbar from '../components/websites/Navbar.jsx';
export default function Campaigns({campaigns}) {
    return (
        <div>
            < Navbar />
            <div className="p-4 w-full flex justify-center bg-gray-100">
                <div className="w-[90%]">
                    < CampaignsCards campaigns={campaigns} />
                </div>
            </div>
        </div>
    );
}
