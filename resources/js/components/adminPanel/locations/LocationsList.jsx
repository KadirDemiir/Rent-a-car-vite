import { MapPin, Phone, Mail, Edit2, Trash2, ChevronRight } from "lucide-react"; // İkonlar için

export default function LocationsList({ locations }) {
    if (!locations || locations.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">Henüz bir lokasyon eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-bottom border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                <div className="col-span-4">Ofis Bilgisi</div>
                <div className="col-span-3">İletişim</div>
                <div className="col-span-3">Şehir / Adres</div>
                <div className="col-span-2 text-right">İşlemler</div>
            </div>

            <div className="divide-y divide-slate-50">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-center hover:bg-slate-50/80 transition-all duration-200"
                    >
                        <div className="col-span-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {location.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {location.name}
                                </h3>
                                <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full mt-1 inline-block">
                                    {location.parent_id ? "Şube" : "Ana Ofis"}
                                </span>
                            </div>
                        </div>

                        <div className="col-span-3 space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Phone size={14} className="text-slate-300" />
                                <span>{location.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Mail size={14} className="text-slate-300" />
                                <span className="truncate">{location.email}</span>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                <MapPin size={14} className="text-blue-400" />
                                <span>{location.city}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1 truncate max-w-50">
                                {location.address}
                            </p>
                        </div>
                        <div className="col-span-2 flex justify-end items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
                                <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer">
                                <Trash2 size={16} />
                            </button>
{/*                            <button className="cursor-pointer md:hidden p-2 text-slate-300">
                                <ChevronRight size={20} />
                            </button>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
