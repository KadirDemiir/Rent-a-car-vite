import { useState } from "react";
import {useTranslation} from "react-i18next";

export default function LanguageInformation({ data, setData }) {
    console.log(data.flag);
    const {t} = useTranslation();
    const [img, setImg] = useState(data.flag && typeof data.flag.value === 'string' ? `/storage/${data.flag.value}` : data.flag.value);

    const handleNameChange = (e) => {
        const d = e.target.value;
        setData((prev) => ({
            ...prev,
            name: {
                ...prev.name,
                value: d,
                error: d.trim() === '' && 'This field can\'t be empty.',
            }}));};

    const handleCodeChange = (e) => {
        const d = e.target.value;
        let error;
        if (d.trim() === '')
            error = 'This field can\'t be empty.';
        else if (d.trim().length !== 2 || /^\d+$/.test(d))
            error = 'This code has to be stand iso 639 language code';
        else
            error = '';
        setData((prev) => ({
            ...prev,
            code: {
                ...prev.code,
                value: d,
                error: error,
            }}));};

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        let err = '';
        if (!file)
            err = "There is no selected file.";
        else if (!file.type.startsWith("image/"))
            err = "You can only upload images";
        else err = "";

        setData((prev) => ({
            ...prev,
            flag: {
                value: file,
                error: err
            }
        }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
            <div className={`w-full grid grid-cols-2 gap-4`}>
                <div className={`flex flex-col items-center p-4 shadow-md border border-gray-300 rounded-md gap-2`}>
                    <label>{t("adminpanel.add_languages.language_name")}</label>
                    <input onChange={(e) => handleNameChange(e)} value={data.name.value} type="text" className={`outline-none border border-gray-400 rounded-md pl-2 py-1`} />
                    {data.name.error && <span className={`text-sm w-full bg-red-400 text-white pl-2 border-l-8 border-red-600`}>*{data.name.error}</span>}
                </div>
                <div className={`flex flex-col items-center p-4 shadow-md border border-gray-300 rounded-md gap-2`}>
                    <label>{t("adminpanel.add_languages.language_code")}</label>
                    <input type="text" className={`outline-none border border-gray-400 rounded-md pl-2 py-1`} value={data.code.value} onChange={(e) => handleCodeChange(e, 'code')} />
                    {data.code.error && <span className={`text-sm w-full bg-red-400 text-white pl-2 border-l-8 border-red-600`}>*{data.code.error}</span>}
                </div>
                <div className={`flex items-center justify-center p-4 shadow-md border border-gray-300 rounded-md gap-2`}>
                    <div className={`flex flex-col items-center p-4 shadow-md border border-gray-300 rounded-md gap-2`}>
                        <label>{t("adminpanel.add_languages.language_flag")}</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className={`outline-none border border-gray-400 rounded-md pl-2 py-1`} />
                        {data.flag.error && <span className={`text-sm w-full bg-red-400 text-white pl-2 border-l-8 border-red-600`}>*{data.flag.error}</span>}
                    </div>
                    {img && <img src={img} alt="Flag Preview" className="w-32 h-32 object-cover rounded-md mt-2" />}
                </div>
            </div>
    );
}
