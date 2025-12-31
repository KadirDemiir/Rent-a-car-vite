import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        map.setView(center, 14);
    }, [center, map]);
    return null;
}

function MapEvents({ setLatitude, setLongitude, latitude, longitude }) {
    useMapEvents({
        click(e) {
            setLatitude(e.latlng.lat);
            setLongitude(e.latlng.lng);
        },
    });
    return latitude && longitude ? <Marker position={[latitude, longitude]} icon={DefaultIcon} /> : null;
}

export default function LocationMap({ latitude, setLatitude, longitude, setLongitude, searchQuery, setSearchQuery, handleSearch }) {
    console.log(typeof (longitude), typeof (latitude));
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">Haritada Konum Seç</label>
                    <div className="relative mt-1">
                        <input
                            type="text"
                            className="w-full pl-4 pr-20 py-2.5 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Adres ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                        <button type={`button`} onClick={handleSearch} className="absolute right-1.5 top-1.5 bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-black transition-colors">
                            Bul
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-mono border border-blue-100">
                    {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                </div>
            </div>

            <div className="h-100 w-full rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner relative z-0">
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={11}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <ChangeView center={[latitude, longitude]} />
                    <MapEvents setLatitude={setLatitude} setLongitude={setLongitude} latitude={latitude} longitude={longitude} />
                </MapContainer>
            </div>
        </div>
    );
}
