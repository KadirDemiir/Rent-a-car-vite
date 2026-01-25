export default function  SiteVariableSection({activeSection, setActiveSection, sections, formData, section_config}){
    const getSectionProgress = (sectionKey) => {
        const sectionKeys = sections[sectionKey];
        const validCount = sectionKeys.filter(key =>
            formData[key.key]?.value?.trim() && !formData[key.key]?.error
        ).length;
        return sectionKeys.length === 0 ? 100 : Math.round((validCount / sectionKeys.length) * 100) ;
    };

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {section_config.map(({ key, label }) => {
                const progress = getSectionProgress(key);
                return (
                    <div key={key} className="space-y-2">
                        <button 
                            onClick={() => setActiveSection(key)}
                            className={`w-full py-2 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 active:scale-95 ${
                                activeSection === key 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                            }`}
                        >
                            {label}
                        </button>
                        <div className="flex h-2 md:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="bg-green-500 transition-all duration-300" 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                            <div 
                                className="bg-red-300 transition-all duration-300" 
                                style={{ width: `${Math.max(0, 100 - progress)}%` }}
                            />
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 text-center font-medium">
                            {progress}%
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
