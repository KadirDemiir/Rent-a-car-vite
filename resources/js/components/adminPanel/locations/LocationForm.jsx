import { useState, useEffect } from "react";
import FormInput from "../car/form/FormInput.jsx";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";

export default function LocationForm({ formData, handleInputChange, errors, locationsOptions, selectedParentLocation, setSelectedParentLocation }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (formData.image && typeof formData.image === 'string') {
            setPreview(formData.image);
        }
    }, [formData.image]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleInputChange({
                target: {
                    name: 'image',
                    value: file
                }
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Ofis Adı" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} />
                <FormInput label="Şehir" name="city" value={formData.city} onChange={handleInputChange} error={errors.city}/>
                <FormInput label="Telefon" name="phone" type="number" value={formData.phone} onChange={handleInputChange} error={errors.phone}/>
                <FormInput label="E-Posta" name="email" value={formData.email} onChange={handleInputChange} error={errors.email}/>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Üst Ofis</label>
                <SelectOptions
                    options={locationsOptions}
                    value={[selectedParentLocation]}
                    onChange={(e) => setSelectedParentLocation(e)}
                    options_name={'Seçiniz'}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Açık Adres</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 transition-all
                    ${errors.address ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"}`}
                    rows="3"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">*{errors.address}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Ofis Görseli</label>
                <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 transition-all
                        ${errors.image ? "border-red-500 bg-red-50" : "border-slate-300 hover:bg-slate-100 hover:border-blue-400"}`}>

                        {preview ? (
                            <div className="relative w-full h-full p-2">
                                <img src={preview} className="w-full h-full object-cover rounded-lg" alt="Önizleme" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-lg">
                                    <p className="text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Değiştirmek için tıklayın</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Resim yüklemek için tıkla</span> veya sürükle</p>
                                <p className="text-xs text-slate-400">PNG, JPG (Max. 2MB)</p>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">*{errors.image}</p>}
            </div>
        </div>
    );
}
