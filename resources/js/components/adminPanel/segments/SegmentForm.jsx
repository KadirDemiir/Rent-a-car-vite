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
    return(
        <div className={`w-full`}>
            <div className={`w-[60%] flex flex-col items-center justify-center gap-4 mx-auto`}>
                <div className={`w-[50%] flex flex-col items-center justify-center gap-2`}>
                    <SelectOptions options={langOptions} value={currentLang} onChange={setCurrentLang} options_name={t("adminpanel.segments.add_segment.select_language")} />
                    <div className="flex h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                        <div className="bg-green-500 transition-all duration-300" style={{ width: `${langProgress()}%` }}/>
                        <div className="bg-red-500 transition-all duration-300" style={{ width: `${100 - langProgress()}%` }}/>
                    </div>
                </div>
                <div className={`w-80  flex flex-col gap-2`}>
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
