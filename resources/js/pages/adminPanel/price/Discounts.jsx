import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useState} from "react";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import {Link} from "@inertiajs/react";
import DiscountList from "../../../components/adminPanel/price/DiscountList.jsx";

export default function Discounts({data}){
    const [sort, setSort] = useState("lates");
    const [isActive, setIsActive] = useState("all");
    const sortOptions = [{label: "Yeni (Başlangıç)", value: "lates"}, {label: "Eski (Başlangıç)", value: "oldest"}];
    const isActivetOptions = [{label: "Tümü", value: "all"}, {label: "Aktif", value: "active"}, {label: "Geçmiş", value: "inactive"}]


    const sortOnChange = (e) => setSort(e);
    const activeOnChange = (e) => setIsActive(e);

    const sortData = (data) => {
        return data.sort((a, b) => {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);

            if (sort === "lates") {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    };

    const sortedData = sortData(data);
    return(
        <div className="w-full h-600">
            < Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className={`text-2xl font-extrabold`}>İndirimler</h3><hr/><br/>
                <div className={`p-4  sm:grid md:flex gap-4`}>
                    <SelectOptions value={sort} options={sortOptions} onChange={sortOnChange} options_name={"Sırala"}/>
                    <SelectOptions value={isActive} options={isActivetOptions} onChange={activeOnChange} options_name={"Durum"}/>
                </div>

                < DiscountList data={sortedData} isActive={isActive}/>
                <br/>
                <div className={`w-full pr-8 flex items-center justify-end`}>
                    <Link href={"/adminpanel/discount/add"} className={`p-2 w-32 bg-green-500 text-white hover:bg-green-600 rounded-xl cursor-pointer flex items-center justify-center`}>Yeni</Link>
                </div>

            </div>
        </div>
    );
}
