import { useState } from "react";
import {useTranslation} from "react-i18next";

export default function LanguageInformation({ data, setData }) {
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
            }}));
    };

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
            }}));
    };

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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Language Name */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 space-y-3 hover:shadow-md transition-shadow duration-200">
                <label className="block text-sm md:text-base font-semibold text-gray-900">
                    {t("adminpanel.add_languages.language_name")}
                </label>
                <input 
                    onChange={handleNameChange} 
                    value={data.name.value} 
                    type="text" 
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border outline-none focus:ring-1 transition-all text-sm md:text-base ${
                        data.name.error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                />
                {data.name.error && (
                    <p className="text-xs md:text-sm text-red-600 font-medium">
                        {data.name.error}
                    </p>
                )}
            </div>

            {/* Language Code */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 space-y-3 hover:shadow-md transition-shadow duration-200">
                <label className="block text-sm md:text-base font-semibold text-gray-900">
                    {t("adminpanel.add_languages.language_code")}
                </label>
                <input 
                    type="text" 
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border outline-none focus:ring-1 transition-all text-sm md:text-base ${
                        data.code.error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    value={data.code.value} 
                    onChange={handleCodeChange}
                />
                {data.code.error && (
                    <p className="text-xs md:text-sm text-red-600 font-medium">
                        {data.code.error}
                    </p>
                )}
            </div>

            {/* Language Flag */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 space-y-3 hover:shadow-md transition-shadow duration-200 md:col-span-1 lg:col-span-1">
                <label className="block text-sm md:text-base font-semibold text-gray-900">
                    {t("adminpanel.add_languages.language_flag")}
                </label>
                <div className="space-y-3">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="w-full text-xs md:text-sm text-gray-500 file:px-3 md:file:px-4 file:py-2 md:file:py-2.5 file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-colors file:cursor-pointer"
                    />
                    {data.flag.error && (
                        <p className="text-xs md:text-sm text-red-600 font-medium">
                            {data.flag.error}
                        </p>
                    )}
                    {img && (
                        <div className="flex justify-center">
                            <img 
                                src={img} 
                                alt="Flag Preview" 
                                className="w-20 h-12 md:w-24 md:h-14 object-cover rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
