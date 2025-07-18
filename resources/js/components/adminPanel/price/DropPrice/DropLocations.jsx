import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import DropForm from "./DropForm.jsx";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";

export default function DropLocations({locations: locationObjects, dropPrice}) {
    const [formattedLocations, setFormattedLocations] = useState([]);
    const [pickUpLocation, setPickUpLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [locationData, setLocationData] = useState({});
    const [locationError, setLocationError] = useState({});
    const currencyOptions = [{label: "TL", value: "try"}, {label: "Euro", value: "eur"}];
    const [currency, setCurrency] = useState(currencyOptions[0].value);
    const [formError, setFormError] = useState();

    useEffect(() => {
        if (locationObjects && locationObjects.length > 0) {
            const formatted = locationObjects.map(location => ({
                label: location.name,
                id: location.id,
                value: location.name.toLowerCase()
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
            initialLocationData[loc.name] = { id: loc.id, value: val?.price || "" };
        });

        setLocationData(initialLocationData);
        setLoading(false);
    }, [pickUpLocation, formattedLocations]);


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
        console.log(formattedLocations);
            const selectedLocation = formattedLocations.find(l => l.value === pickUpLocation);
        const data = new FormData();
        data.append("locations", JSON.stringify(locationData));
        data.append("pickup_location_id", selectedLocation.id);
        data.append("currency", currency);
        data.append("type", "locations_price");

        router.post('/adminpanel/drop-price', data, {
            onError: (errors) => {
                console.error("Sunucu hatası:", errors);
            },
            onSuccess: () => {
                setLocationError({});
                window.scrollTo({top: 0, behavior: "smooth"});
            },
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-4 bg-gray-50 shadow-md rounded-xl p-6 ">
            <h3 className="col-span-4 flex items-center justify-center font-semibold">Lokasyonlar Arası Ücretler</h3>
            <p className="col-span-4 text-sm font-semibold">*Alış Yeri Yenilemenizde Fiyatlar Sıfırlanır.</p>
            <div className="col-span-4">
                {formError && <div className="p-2 border-l-12 border-red-600 bg-red-400 text-white">{formError}</div>}
            </div>
            <div className="col-span-4 flex gap-8">
                <SelectOptions
                    value={pickUpLocation}
                    options={formattedLocations}
                    onChange={(e) => {
                        setPickUpLocation(e);
                        setLocationData({});
                        setLocationError({});
                    }}
                    options_name={"Alış Yeri"}
                />
                <SelectOptions
                    options={currencyOptions}
                    value={currency}
                    onChange={(e) => setCurrency(e)}
                    options_name="Para Birimi"
                />
            </div>
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
    );
}
