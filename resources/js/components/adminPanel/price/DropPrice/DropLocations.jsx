import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import DropForm from "./DropForm.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";

export default function DropLocations({locations: locationObjects, dropPrice, onSuccess, onError, currencies}) {
    const {t} = useTranslation();
    const [formattedLocations, setFormattedLocations] = useState([]);
    const [pickUpLocation, setPickUpLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [locationData, setLocationData] = useState({});
    const [locationError, setLocationError] = useState({});
    const currencyOptions = currencies?.map(c => ({label: `${c.code.toUpperCase()} (${c.symbol})`, value: c.id,}));
    const [currency, setCurrency] = useState(currencyOptions[0]?.value);
    const [formError, setFormError] = useState();

    useEffect(() => {
        if (locationObjects && locationObjects.length > 0) {
            const formatted = locationObjects.map(location => ({
                label: location.name,
                id: location.id,
                value: location.name.toLowerCase(),
            }));

            setFormattedLocations(formatted);
            setPickUpLocation(formatted[0].value);
        }
    }, [locationObjects]);

    useEffect(() => {
        if (formattedLocations.length === 0 || !pickUpLocation) return;

        const selectedLocation = formattedLocations.find(l => l.value === pickUpLocation);
        const initialLocationData = {};

        locationObjects.forEach(loc => {
            const val = dropPrice.find(dp => dp.from_location_id === selectedLocation.id && dp.to_location_id === loc.id);
            initialLocationData[loc.name] = {id: loc.id, value: val?.price || ""};
        });

        setLocationData(initialLocationData);
        setLoading(false);
    }, [pickUpLocation, formattedLocations, locationObjects, dropPrice]);

    const handleCityPricesSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if (Object.keys(locationError).length > 0) {
            setFormError("Lütfen Hataları Çözünüz");
            return;
        }

        const emptyFields = Object.entries(locationData).filter(([_, val]) => !val.value);
        if (emptyFields.length > 0) {
            setFormError("Lütfen tüm alanları doldurunuz.");
            return;
        }
        const selectedLocation = formattedLocations.find(l => l.value === pickUpLocation);
        const data = new FormData();
        data.append("locations", JSON.stringify(locationData));
        data.append("pickup_location_id", selectedLocation.id);
        data.append("currency", currency);
        data.append("type", "locations_price");

        axios.post("/adminpanel/drop-price", data)
            .then((res) => {
                setLocationError({});
                window.scrollTo({top: 0, behavior: "smooth"});
                if (res.data?.success) {
                    onSuccess?.(res.data.success);
                }
            })
            .catch((errors) => {
                console.error("Sunucu hatası:", errors);
                const message = errors.response?.data?.error || errors.message;
                if (message) {
                    onError?.(message);
                }
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                <div className="space-y-1 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">Lokasyonlar Arası Ücretler</h3>
                    <p className="text-xs font-semibold text-gray-500">
                        *{t("adminpanel.pricing.drop_price.locations_price.your_purchase_history_is_reset_every_time_you_renew")}
                    </p>
                </div>
                {formError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {formError}
                    </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                    <SelectOptions value={pickUpLocation} options={formattedLocations}
                        onChange={(e) => {
                            setPickUpLocation(e);
                            setLocationData({});
                            setLocationError({});
                        }} options_name={t("adminpanel.pricing.drop_price.locations_price.pick_up_location")}/>
                    <SelectOptions
                        options={currencyOptions}
                        value={[currency]}
                        onChange={setCurrency}
                        options_name={t("adminpanel.pricing.drop_price.locations_price.pick_up_location")}
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DropForm
                        handleSubmit={handleCityPricesSubmit}
                        opt={locationObjects.map(loc => loc.name)}
                        data={locationData}
                        setData={setLocationData}
                        error={locationError}
                        setError={setLocationError}
                        pickup={pickUpLocation}
                    />
                </div>
            </div>
        </section>
    );
}
