import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useMemo, useState} from "react";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import {Link} from "@inertiajs/react";
import DiscountList from "../../../components/adminPanel/price/DiscountList.jsx";
import {useTranslation} from "react-i18next";
import i18n from "../../../i18n.js";
import { Plus } from "lucide-react";

const DEFAULT_SORT = "latest";
const DEFAULT_STATUS = "all";

export default function Discounts({data = []}) {
    const {t, i18n} = useTranslation();
    const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
    const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);

    const sortOptions = useMemo(() => ([
        {
            label: t("adminpanel.pricing.discounts.filter.sort.newest_based_on_start_date"),
            value: "latest"
        },
        {
            label: t("adminpanel.pricing.discounts.filter.sort.oldest_based_on_start_date"),
            value: "oldest"
        }
    ]), [t]);

    const statusOptions = useMemo(() => ([
        { label: t("adminpanel.pricing.discounts.filter.status.all"), value: "all" },
        { label: t("adminpanel.pricing.discounts.filter.status.active"), value: "active" },
        { label: t("adminpanel.pricing.discounts.filter.status.passed"), value: "inactive" }
    ]), [t]);

    const sortedDiscounts = useMemo(() => {
        if (!Array.isArray(data)) return [];

        return [...data].sort((a, b) => {
            const dateA = new Date(a?.start_date ?? 0).getTime();
            const dateB = new Date(b?.start_date ?? 0).getTime();
            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });
    }, [data, sortOrder]);

    const filteredDiscounts = useMemo(() => {
        if (statusFilter === "all") return sortedDiscounts;
        return sortedDiscounts.filter(discount => (discount?.status || "inactive") === statusFilter);
    }, [sortedDiscounts, statusFilter]);

    const hasDiscounts = filteredDiscounts.length > 0;

    return (
        <Navbar>
            <div className="flex flex-col gap-6 p-4 md:p-8 min-h-screen bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {t("adminpanel.pricing.discounts.discounts")}
                        </h1>
                    </div>

                    <Link
                        href={`/${i18n.language}/${t('address.adminpanel')}/${t('address.discounts')}/${t('address.add')}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Plus className="h-5 w-5" />
                        {t("adminpanel.pricing.discounts.add_new")}
                    </Link>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-64">
                            <SelectOptions 
                                value={sortOrder} 
                                options={sortOptions} 
                                onChange={setSortOrder} 
                                options_name={t("adminpanel.pricing.discounts.filter.sort.sort")}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <SelectOptions 
                                value={statusFilter} 
                                options={statusOptions} 
                                onChange={setStatusFilter} 
                                options_name={t("adminpanel.pricing.discounts.filter.status.status")}
                            />
                        </div>
                    </div>
                </div>

                {hasDiscounts ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <DiscountList data={filteredDiscounts} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">
                        <div className="mb-4 rounded-full bg-blue-50 p-3 text-blue-600">
                             <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                             </svg>
                        </div>
                        <h3 className="mb-1 text-lg font-medium text-gray-900">
                             {t("adminpanel.general.no_data")}
                        </h3>
                        {t("adminpanel.pricing.discounts.empty_state") && (
                            <p className="text-sm text-gray-500">
                                {t("adminpanel.pricing.discounts.empty_state")}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Navbar>
    );
}
