import { Globe, Settings, Layers, CheckCircle } from "lucide-react";

const SECTION_ICONS = {
    website: Globe,
    adminpanel: Settings,
    general: Layers
};

export default function SiteVariableSection({activeSection, setActiveSection, sections, formData, section_config}){
    const getSectionProgress = (sectionKey) => {
        const sectionKeys = sections[sectionKey];
        const validCount = sectionKeys.filter(key =>
            formData[key.key]?.value?.trim() && !formData[key.key]?.error
        ).length;
        return sectionKeys.length === 0 ? 100 : Math.round((validCount / sectionKeys.length) * 100);
    };

    return(
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {section_config.map(({ key, label }) => {
                const progress = getSectionProgress(key);
                const Icon = SECTION_ICONS[key] || Layers;
                const isComplete = progress === 100;
                const isActive = activeSection === key;
                
                return (
                    <button 
                        key={key}
                        onClick={() => setActiveSection(key)}
                        className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                            isActive 
                                ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border-gray-600 shadow-lg ring-2 ring-gray-300 ring-offset-2' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isActive ? 'bg-white/20' : 'bg-gray-100'
                            }`}>
                                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-600'} />
                            </div>
                            <span className="font-semibold text-sm sm:text-base capitalize">{label}</span>
                            {isComplete && (
                                <CheckCircle size={18} className={`ml-auto ${isActive ? 'text-green-300' : 'text-green-500'}`} />
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {sections[key].length}
                                </span>
                                <span className={`text-sm font-bold ${
                                    isComplete 
                                        ? (isActive ? 'text-green-300' : 'text-green-500')
                                        : (isActive ? 'text-white' : 'text-gray-700')
                                }`}>
                                    {progress}%
                                </span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${
                                isActive ? 'bg-white/20' : 'bg-gray-200'
                            }`}>
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        isComplete 
                                            ? 'bg-green-400' 
                                            : (isActive ? 'bg-white' : 'bg-gray-500')
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
