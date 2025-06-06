import { usePage } from "@inertiajs/react";
import Navbar from "../components/websites/Navbar.jsx";

export default function CampaignsIndex()
{
    const { campaign } = usePage().props;
    return(
        <div>
            < Navbar />
            <div className="w-full h-500 flex flex-col items-center  bg-gray-100">
                <div className="w-[70%] mt-8 bg-white shadow-2xl rounded-2xl">
                    <div className="w-full flex items-center justify-center">
                        <img src="/storage/kayseri-havalani.png" alt="" className="w-full h-auto rounded-2xl" />
                    </div>
                    <div className="m-8">Kampanya detayları</div>
                </div>
            </div>
        </div>
    );
}
