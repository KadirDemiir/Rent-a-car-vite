import {Plane, Phone, Mail} from 'lucide-react';
export default function LocationCard({location}){
    return(
        <div className="col-span-1 rounded-2xl bg-white shadow-md">
            <img src="/storage/kayseri-havalani.png" alt="" className="rounded-t-2xl  h-60" />
            <br />
            <div className="mx-4 pb-16 grid gap-6 ">
                <div className="font-extrabold text-xl font-sans">Kayseri Havalanı</div>
                <div className="font-normal text-gray-700">Kayseri Havalanı</div>
                <div className="flex gap-4 h-8 items-center">
                    {/*<img src="/storage/svg/locationCard/plane.svg" className="h-6 w-4" alt="" />*/}
                    <Plane />
                    <div className="font-medium text-gray-700">Yeşil, Mustafa Kemal Paşa Blv., 38090 Kocasinan/Kayseri</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    {/*<img src="/storage/svg/locationCard/phone.svg" className="h-6 w-4" alt="" />*/}
                    <Phone/>
                    <div className="font-medium text-gray-700">+905555555555</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    {/*<img src="/storage/svg/locationCard/mail.svg" className="h-6 w-4" alt="" />*/}
                    <Mail/>
                    <div className="font-medium text-gray-700">deneme@deneme.com</div>
                </div>
            </div>
        </div>
    );
}
