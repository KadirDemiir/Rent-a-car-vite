import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";

export default function DropPrice(){
    useEffect(() => {
        const fetchedLocations = ["Ankara", "İstanbul", "Nevşehir", "Bursa"];
        setTemp(fetchedLocations);
        setPickUpLocation(fetchedLocations[0].toLowerCase());
        setLocations(fetchedLocations.map(location => ({
            label: location,
            value: location.toLowerCase()
        })));
        setLoading(false);
    }, []);

    const [temp, setTemp] = useState([]);
    const [locations, setLocations] = useState([]);
    const [pickUpLocation, setPickUpLocation] = useState("");
    const [loading, setLoading] = useState(true);

    const segments = ['economy', 'compact', 'midrange', 'premium'];

    const PULocationOnChange = (e) => { setPickUpLocation(e) };

    const handleSegmentCoefficient = (e) => {
        e.preventDefault();
    };

    const handleCityPricesSubmit = (e) => {
        e.preventDefault();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return(
        <div className="w-full h-600">
            <Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className="font-semibold">Drop Ücretleri</h3>
                <hr/><br/>
                <div className="w-42">
                    <SelectOptions
                        value={pickUpLocation}
                        options={locations}
                        onChange={PULocationOnChange}
                        options_name={"Yerler"}
                    />
                </div>
                <br/><br/>

                <form onSubmit={handleSegmentCoefficient}>
                    <div className="grid grid-cols-4 gap-4 bg-gray-50 shadow-md rounded-xl p-6 border-2 border-blue-500">
                        <h3 className="col-span-4 flex items-center justify-center font-semibold">Araç Segment Katsayısı</h3>
                        {segments.map((s, index) => (
                            <div key={index}>
                                <label className="block mb-1 font-medium text-sm text-gray-700">{s}</label>
                                <input
                                    type="number"
                                    min={1}
                                    placeholder={`${s} katsayısı`}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        ))}
                        <button type="submit" className="p-4 justify-self-end w-24 col-span-4 bg-blue-500 text-white rounded-xl hover:bg-blue-700 cursor-pointer">Kaydet</button>
                    </div>
                </form>
                <br/><br/>

                <form onSubmit={handleCityPricesSubmit}>
                    <div className="grid grid-cols-4 gap-6 bg-gray-50 shadow-md rounded-xl p-6 border-2 border-blue-500">
                        <h3 className="col-span-4 flex items-center justify-center font-semibold">Şehirler Arası Ücret</h3>
                        {temp.map((location, index) => (
                            <div key={index}>
                                <label className="block mb-1 font-medium text-sm text-gray-700">
                                    {location}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    placeholder={`${pickUpLocation} - ${location}`}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <button type="submit" className="col-span-4 justify-self-end w-24 bg-blue-500 hover:bg-blue-700 rounded-xl p-4 text-white cursor-pointer">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
