import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useState} from "react";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import {Link} from "@inertiajs/react";
import DiscountList from "../../../components/adminPanel/price/DiscountList.jsx";
import {useTranslation} from "react-i18next";

export default function Discounts({data}){
    const {t} = useTranslation();
    const [sort, setSort] = useState("lates");
    const [isActive, setIsActive] = useState("all");
    const sortOptions = [{label: t("adminpanel.pricing.discounts.filter.sort.newest_based_on_start_date"), value: "lates"}, {label: t("adminpanel.pricing.discounts.filter.sort.oldest_based_on_start_date"), value: "oldest"}];
    const isActivetOptions = [{label: "all", value: "all"}, {label: t("adminpanel.pricing.discounts.filter.status.active"), value: "active"}, {label: t("adminpanel.pricing.discounts.filter.status.passed"), value: "inactive"}]


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
            < Navbar >
                <h3 className={`text-2xl font-extrabold`}>{t("adminpanel.pricing.discounts.discounts")}</h3><hr/><br/>
                <div className={`p-4  sm:grid md:flex gap-4`}>
                    <SelectOptions value={sort} options={sortOptions} onChange={sortOnChange} options_name={t("adminpanel.pricing.discounts.filter.sort.sort")}/>
                    <SelectOptions value={isActive} options={isActivetOptions} onChange={activeOnChange} options_name={t("adminpanel.pricing.discounts.filter.status.status")}/>
                </div>

                < DiscountList data={sortedData} isActive={isActive}/>
                <br/>
                <div className={`w-full pr-8 flex items-center justify-end`}>
                    <Link href={"/adminpanel/discount/add"} className={`p-2 w-32 bg-green-500 text-white hover:bg-green-600 rounded-xl cursor-pointer flex items-center justify-center`}>{t("adminpanel.pricing.discounts.add_new")}</Link>
                </div>

            </Navbar>
        </div>
    );
}
