import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useMemo, useState} from "react";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import {Link} from "@inertiajs/react";
import DiscountList from "../../../components/adminPanel/price/DiscountList.jsx";
import {useTranslation} from "react-i18next";
import i18n from "../../../i18n.js";

const DEFAULT_SORT = "latest";
const DEFAULT_STATUS = "all";

export default function Discounts({data = []}) {
    const {t} = useTranslation();
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
        { label: t("adminpanel.pricing.discounts.filter.status.all") || "All", value: "all" },
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
        <div className="w-full min-h-[600px]">
            <Navbar>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-extrabold">
                            {t("adminpanel.pricing.discounts.discounts")}
                        </h3>
                        <hr className="mt-4" />
                    </div>

                    <div className="p-4 grid gap-4 md:flex md:items-center">
                        <SelectOptions value={sortOrder} options={sortOptions} onChange={setSortOrder} options_name={t("adminpanel.pricing.discounts.filter.sort.sort")}/>
                        <SelectOptions value={statusFilter} options={statusOptions} onChange={setStatusFilter} options_name={t("adminpanel.pricing.discounts.filter.status.status")}/>
                    </div>

                    {hasDiscounts ? (
                        <DiscountList data={filteredDiscounts} />
                    ) : (
                        <div className="w-full rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                            {t("adminpanel.pricing.discounts.empty_state") || t("adminpanel.general.no_data")}
                        </div>
                    )}

                    <div className="flex items-center justify-end pr-8">
                        <Link
                            href={`/${i18n.language}/${t('address.discounts')}/${'address.add'}`}
                            className="flex w-32 items-center justify-center rounded-xl bg-green-500 p-2 text-white transition hover:bg-green-600"
                        >
                            {t("adminpanel.pricing.discounts.add_new")}
                        </Link>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}
