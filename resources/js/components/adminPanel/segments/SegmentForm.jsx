import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function SegmentForm({langOptions, currentLang, setCurrentLang, formData, setFormData}){
    const {t} = useTranslation();
    const langProgress = () => {
        const total = Object.keys(formData.name).length;
        const filled = Object.entries(formData.name).filter(([key, value]) => value.value.trim() !== "" ).length;
        return filled*100/total;
    }


    const coefficientHandler = (e) => {
        const val = e.target.value;
        let err = "";
        if (!/^\d*\.?\d*$/.test(val) || val[0] === '.') {
            err = t("adminpanel.segments.add_segment.you_can_enter_only_number");
        }else if(val <= 0)
            err = t("adminpanel.segments.add_segments.number_must_be_greater_zero")
        setFormData(prev => ({
            ...prev,
            coefficient: {
                ...prev.coefficient,
                value: val,
                error: err
            }
        }));
    }
    
    const progressPercentage = Math.round(langProgress());

    return(
        <div className={`w-full`}>
            <div className={`w-[80%] md:w-[60%] flex flex-col items-center justify-center gap-6 mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100`}>
                <div className="w-full flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">{t("adminpanel.segments.add_segment.select_language")}</span>
                        <span className={`font-bold ${progressPercentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                             %{progressPercentage}
                        </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-300 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
    
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent justify-center">
                        {langOptions.map((l) => {
                            const isFilled = formData.name[l.value]?.value?.trim() !== "";
                            const isActive = currentLang === l.value;
                            return (
                                <button
                                    key={l.value}
                                    type="button"
                                    onClick={() => setCurrentLang(l.value)}
                                    className={`
                                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all select-none
                                        ${isActive 
                                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200' 
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }
                                        ${!isFilled && !isActive ? 'border-red-200 text-red-600' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        {l.label}
                                        {isFilled && (
                                            <span className={`flex items-center justify-center w-4 h-4 text-[10px] rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'}`}>
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={`w-full md:w-80 flex flex-col gap-2`}>
                    <div className={`flex justify-center`}>{t("adminpanel.segments.add_segment.segment_name")}:</div>
                    <input value={formData.name[currentLang].value}   onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            name: {
                                ...prev.name,
                                [currentLang]: {
                                    ...prev.name[currentLang],
                                    value: e.target.value
                                }
                            }
                        }))
                    } type="text" className={`outline-none border border-gray-500 rounded-lg pl-2 py-1`}/>
                    {formData.name[currentLang].error && <span className={`p-1 border-l-12 border-red-600 bg-red-200 text-red-700 break-all`}>*{formData.name[currentLang].error}</span>}
                </div>
                <div className={`w-80 flex flex-col gap-2`}>
                    <div className={`flex justify-center`}>{t("adminpanel.segments.add_segment.segment_coefficient")}:</div>
                    <input value={formData.coefficient.value} onChange={(e) => coefficientHandler(e)} type="text" className={`outline-none border border-gray-500 rounded-lg pl-2 py-1`}/>
                    {formData.coefficient.error && <span className={`p-1 border-l-12 border-red-600 bg-red-200 text-red-700 break-all`}>*{formData.coefficient.error}</span>}
                </div>
            </div>
        </div>
    );
}
