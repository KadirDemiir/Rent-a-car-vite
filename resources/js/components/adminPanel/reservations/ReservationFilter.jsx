import {useEffect, useState} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function ReservationFilter({originalRes, res, setRes}) {
    const {t} = useTranslation();
    const [status, setStatus] = useState(['pending']);
    const [sort, setSort] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (!Array.isArray(originalRes)) {
            return;
        }

        let processedRes = [...originalRes];

        if (status.length > 0 && !(status.length === 1 && status[0] === "")) {
            processedRes = processedRes.filter(r => status.includes(r.status));
        }

        if (filter) {
            processedRes = processedRes.filter(r =>
                JSON.stringify(r).toLowerCase().includes(filter.toLowerCase())
            );
        }

        switch (sort) {
            case "priceInc":
                processedRes.sort((a, b) => a.total_price - b.total_price);
                break;
            case "priceDesc":
                processedRes.sort((a, b) => b.total_price - a.total_price);
                break;
            case "recently":
                processedRes.sort((a, b) => new Date(b.return_datetime) - new Date(a.return_datetime));
                break;
            case "oldest":
                processedRes.sort((a, b) => new Date(a.return_datetime) - new Date(b.return_datetime));
                break;
        }

        setRes(processedRes);

    }, [status, sort, filter, originalRes]);

    return (
        <div className="w-full p-5 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="flex items-center gap-2 w-full sm:w-60">
                    <SelectOptions
                        value={sort}
                        onChange={(e) => setSort(e)}
                        options={[
                            { label: t("adminpanel.reservation.filter.sort.suggested"), value: "primary" },
                            { label: t("adminpanel.reservation.filter.sort.increase_based_price"), value: "priceInc" },
                            { label: t("adminpanel.reservation.filter.sort.decrease_based_price"), value: "priceDesc" },
                            { label: t("adminpanel.reservation.filter.date_based_latest"), value: "recently" },
                            { label: t("adminpanel.reservation.filter.date_based_oldest"), value: "oldest" },
                        ]}
                        options_name={t("adminpanel.reservation.filter.sort.sort_label")}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-72">
                    <SelectOptions
                        value={status}
                        onChange={setStatus}
                        options={[
                            { label: "All", value: ""},
                            { label: "Onaylandı", value: "confirmed" },
                            { label: "Beklemede", value: "pending" },
                            { label: "İptal", value: "cancelled" },
                            { label: "Tamamlandı", value: "completed" },
                        ]}
                        options_name={t("adminpanel.reservation.filter.status")}
                        multiple={true}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:ml-auto w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder={t("adminpanel.reservation.filter.filer")}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                    />
                </div>
            </div>
        </div>
    );
}
