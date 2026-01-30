import { useState } from "react";

const Input = ({type, elementName, labelName, validate, onChange, maxV, prefix, initialValue, formData, errors, setFormData, setErrors, showErrors = false}) => {
    const day = new Date();
    const onSekizYilOnce = new Date(day.setFullYear(day.getFullYear() - 18))
        .toISOString()
        .split('T')[0];

    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return "00 . 00 . 0000";
        const [year, month, day] = dateStr.split("-");
        return `${day} . ${month} . ${year}`;
    };

    const handleChange = (e) => {
        let newValue = e.target.value;
        if(maxV) {
            newValue = newValue.slice(0, maxV);
        }
        if (prefix && type !== 'date') {
            if(newValue.length >= prefix.length)
                newValue = newValue.slice(prefix.length);
            else
                newValue = '';
        }

        if (setFormData) {
            setFormData({
                ...formData,
                [elementName]: newValue
            });
        }

        let errorMessage = '';
        if (errors[elementName] && validate) {
            errorMessage = validate(newValue);
        }

        if (setErrors) {
            setErrors({
                ...errors,
                [elementName]: errorMessage
            });
        }

        onChange(newValue, errorMessage);
    };

    return (
        <div className="w-full flex flex-col gap-1.5">
            {labelName && (
                <label className="text-[11px] font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">
                    {labelName}
                </label>
            )}
            
            <div className="relative w-full group">
                {type === 'date' ? (
                    <div 
                        onClick={(e) => e.currentTarget.querySelector('input').showPicker()}
                        className={`h-10 w-full border-2 rounded-2xl flex items-center justify-between px-5 bg-white transition-all duration-300 cursor-pointer
                            ${errors?.[elementName] ? 'border-red-500 shadow-sm shadow-red-100' : 'border-slate-100 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-50'}`}
                    >
                        <span className={`font-mono text-lg tracking-[0.2em] ${formData?.[elementName] ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
                            {formatDateForDisplay(formData?.[elementName])}
                        </span>
                        
                        <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <input
                            type="date"
                            name={elementName}
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
                            value={formData?.[elementName] || ''}
                            onChange={handleChange}
                            max={(elementName === 'birthday') ? onSekizYilOnce : undefined}
                        />
                    </div>
                ) : (
                    <input
                        type={type}
                        name={elementName}
                        required    
                        className={`h-10 w-full border-2 rounded-2xl px-5 outline-none transition-all duration-300 font-medium text-slate-800
                            ${errors?.[elementName] ? 'border-red-500 shadow-sm shadow-red-100' : 'border-slate-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-50'}`}
                        value={prefix ? prefix + (formData?.[elementName] || '') : (formData?.[elementName] || '')}
                        onChange={handleChange}
                        maxLength={maxV ? maxV : ""}
                    />
                )}
            </div>

            {showErrors && errors?.[elementName] && (
                <div className="mt-1 px-2 text-[11px] font-bold text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    {errors[elementName]}
                </div>
            )}
        </div>
    );
}

export default Input;