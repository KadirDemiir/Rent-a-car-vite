import { Link } from "@inertiajs/react";

export default function CampaignsCard({campaigns}){
    return(
        <div className="grid md:grid-cols-2 lg:grid-cols-2 sm:grid-col-2 gap-4">
        <div className="col-span-1 rounded-2xl bg-white shadow-md"> 
            <img src="/storage/kayseri-havalani.png" alt="" className="rounded-t-2xl w-full  h-80" />
            <br />
            <div className="mx-4 pb-16 grid gap-6 ">
                KAMPANYA
            </div>
        </div>
        <Link href="/campaigns/1" className="col-span-1 rounded-2xl bg-white shadow-md">
            <img src="/storage/kayseri-havalani.png" alt="" className="rounded-t-2xl w-full  h-80" />
            <br />
            <div className="mx-4 pb-16">
                KAMPANYA
            </div>
        </Link>
    </div>
    );
}