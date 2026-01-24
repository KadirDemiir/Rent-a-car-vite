import CampaignsCards from '../components/websites/campaignsCard/CampaignsCards.jsx';
import Navbar from '../components/websites/Navbar.jsx';
import { useTranslation } from 'react-i18next';

export default function Campaigns({campaigns}) {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            <Navbar />
            
            {/* Campaigns Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <CampaignsCards campaigns={campaigns} />
            </div>
        </div>
    );
}
