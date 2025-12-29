import FormInput from "../car/form/FormInput.jsx";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";

export default function LocationForm({ formData, handleInputChange, errors, locationsOptions, selectedParentLocation, setSelectedParentLocation }) {
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
                    ${errors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    }`}
                    rows="3"
                />
                {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">*{errors.address}</p>
                )}
            </div>
        </div>
    );
}
