import CampaignsCard from '../components/campaignsCard/CampaignsCard';
import Navbar from '../components/Navbar';
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