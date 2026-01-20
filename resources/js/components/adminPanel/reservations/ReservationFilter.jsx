import {useEffect, useState} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function ReservationFilter({originalRes, res, setRes}) {
    const {t} = useTranslation();
    const [status, setStatus] = useState([]);
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
        <div className="w-full p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-44">
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-36">
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto">
                <label className="text-sm font-medium text-gray-700">{t("adminpanel.reservation.filter.filer")}</label>
                <input
                    type="text"
                    placeholder={t("adminpanel.reservation.filter.filer")}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm w-full sm:w-auto"
                />
            </div>
        </div>
    );
}
