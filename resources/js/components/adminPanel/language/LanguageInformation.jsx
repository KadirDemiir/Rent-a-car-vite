import { useState } from "react";
import {useTranslation} from "react-i18next";
import { Type, Hash, Flag, Upload, AlertCircle } from "lucide-react";

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
                error: d.trim() === '',
            }}));
    };

    const handleCodeChange = (e) => {
        const d = e.target.value;
        let error = false;
        if (d.trim() === '' || d.trim().length !== 2 || /^\d+$/.test(d))
            error = true;
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
        let err = false;
        if (!file || !file.type.startsWith("image/"))
            err = true;

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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Language Name */}
            <div className={`bg-white rounded-xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
                data.name.error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        data.name.error ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                        <Type size={20} className={data.name.error ? 'text-red-600' : 'text-blue-600'} />
                    </div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-900">
                        {t("adminpanel.add_languages.language_name")}
                    </label>
                    {data.name.error && (
                        <AlertCircle size={16} className="text-red-500 ml-auto" />
                    )}
                </div>
                <input 
                    onChange={handleNameChange} 
                    value={data.name.value} 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all text-sm sm:text-base ${
                        data.name.error 
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-white' 
                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100 bg-gray-50 focus:bg-white'
                    }`}
                />
            </div>

            {/* Language Code */}
            <div className={`bg-white rounded-xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
                data.code.error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        data.code.error ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                        <Hash size={20} className={data.code.error ? 'text-red-600' : 'text-green-600'} />
                    </div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-900">
                        {t("adminpanel.add_languages.language_code")}
                    </label>
                    {data.code.error && (
                        <AlertCircle size={16} className="text-red-500 ml-auto" />
                    )}
                </div>
                <input 
                    type="text" 
                    maxLength={2}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all text-sm sm:text-base uppercase font-mono tracking-widest text-center ${
                        data.code.error 
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-white' 
                            : 'border-gray-200 focus:border-green-400 focus:ring-green-100 bg-gray-50 focus:bg-white'
                    }`}
                    value={data.code.value} 
                    onChange={handleCodeChange}
                />
            </div>

            {/* Language Flag */}
            <div className={`bg-white rounded-xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
                data.flag.error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        data.flag.error ? 'bg-red-100' : 'bg-purple-100'
                    }`}>
                        <Flag size={20} className={data.flag.error ? 'text-red-600' : 'text-purple-600'} />
                    </div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-900">
                        {t("adminpanel.add_languages.language_flag")}
                    </label>
                    {data.flag.error && (
                        <AlertCircle size={16} className="text-red-500 ml-auto" />
                    )}
                </div>
                <div className="space-y-4">
                    <label className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        data.flag.error 
                            ? 'border-red-300 hover:border-red-400 bg-red-50/30' 
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                    }`}>
                        <Upload size={24} className={data.flag.error ? 'text-red-400' : 'text-gray-400'} />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    {img && (
                        <div className="flex justify-center">
                            <div className="relative">
                                <img 
                                    src={img} 
                                    alt="" 
                                    className="w-24 h-16 sm:w-28 sm:h-18 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
