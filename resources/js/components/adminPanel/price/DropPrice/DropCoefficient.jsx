import DropForm from "./DropForm.jsx";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {use} from "i18next";

export default function DropCoefficient({segments}){
    const name = segments.map(s => s.name);
    const [coeffiData, setCoeffiData] = useState({});
    const [coeffiError, setCoeffiError] = useState({});
    const [formError, setFormError] = useState();

    useEffect(() => {
        segments.map((s) => {
            setCoeffiData(prev => ({
                ...prev,
                [s.name]: {value: s.coefficient},
            }))
        })
    }, []);
    const handleSubmitSegmentCoefficient = (e) => {
        e.preventDefault();
        setFormError("");
        if(Object.keys(coeffiError).length > 0){
            setFormError("Lütfen Hataları Çözünüz");
            return;
        }
        const emptyFields = Object.entries(coeffiData).filter(([_, val]) => !val);
        if (emptyFields.length > 0) {
            setFormError("Lütfen tüm alanları doldurunuz.");
        return;
        }
            const data = new FormData();
            data.append("coefficients", JSON.stringify(coeffiData));
            data.append("type", "segment_coefficient");
            router.post('/adminpanel/drop-price', data, {
                onError: (errors) => {
                    console.error("Sunucu hatası:", errors);
                },
                onSuccess: () => {
                    setCoeffiError({});
                },
            });
    };
    return(
        <>
            <h3 className="font-semibold">Drop Ücretleri</h3>
            <hr/><br/>
            <br/><br/>
            <div className="grid grid-cols-4 gap-4 bg-gray-50 shadow-md rounded-xl p-6 ">
                <h3 className="col-span-4 flex items-center justify-center font-semibold">Araç Segment Katsayısı</h3>
                <div className={`col-span-4`}>
                    {formError && <div className={`p-2 border-l-12 border-red-600 bg-red-400 text-white`}>{formError}</div>}
                </div>
                <DropForm handleSubmit={handleSubmitSegmentCoefficient} opt={name} data={coeffiData} setData={setCoeffiData} error={coeffiError} setError={setCoeffiError} minZero={false}/>
            </div>
        </>
    );
}
