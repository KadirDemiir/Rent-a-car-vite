export default function  SiteVariableSection({activeSection, setActiveSection, sections, formData, section_config}){
    const getSectionProgress = (sectionKey) => {
        const sectionKeys = sections[sectionKey];
        const validCount = sectionKeys.filter(key =>
            formData[key.key]?.value?.trim() && !formData[key.key]?.error
        ).length;
        return sectionKeys.length === 0 ? 100 : Math.round((validCount / sectionKeys.length) * 100) ;
    };
    return(
        <>
            {section_config.map(({ key, label }) => {
                const progress = getSectionProgress(key);
                return (
                    <div key={key} className="space-y-2 w-32">
                        <button onClick={() => setActiveSection(key)}
                                className={`w-full py-2 px-4 rounded-xl text-white transition-colors ${
                                    activeSection === key ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
                                }`} >
                            {label}
                        </button>
                        <div className="flex h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div className="bg-green-500 transition-all duration-300" style={{ width: `${progress !== 100 ? 80 : progress}%` }}/>
                            <div className="bg-red-300 transition-all duration-300" style={{ width: `${(100 - progress ) !== 0 ? 20 : (100 - progress)}%` }}/>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
