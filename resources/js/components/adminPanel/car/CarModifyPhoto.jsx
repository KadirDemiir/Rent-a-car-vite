import {useMemo} from "react";

export function CarModifyPhoto({ photos = [] }) {
    const { coverPhoto, otherPhotos } = useMemo(() => {
        const cover = photos.find((photo) => photo.is_cover) || photos[0];
        const others = photos.filter((photo) => photo.id !== cover?.id).slice(0, 3);
        return { coverPhoto: cover, otherPhotos: others };
    }, [photos]);

    return (
        <div className="w-full h-full flex flex-col md:flex-row">
            <div className="h-full basis-0 grow md:basis-3/4 flex items-center justify-center bg-white overflow-hidden relative">
                {coverPhoto ? (
                    <img
                        src={`/storage/${coverPhoto.photo_path}`}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                    />
                ) : (
                    <div className="text-gray-400">No Cover Photo</div>
                )}
            </div>

            <div className="h-20 w-full md:w-auto md:h-full md:basis-1/4 grid grid-cols-3 md:grid-cols-1 md:grid-rows-3 bg-gray-100 border-t md:border-t-0 md:border-l border-gray-200">
                {otherPhotos.map((photo, index) => (
                    <div key={photo.id || index} className="relative bg-white flex items-center justify-center overflow-hidden border-r md:border-r-0 border-gray-200 last:border-r-0 md:border-b last:md:border-b-0 h-full">
                        <img
                            src={`/storage/${photo.photo_path}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ))}
                {[...Array(Math.max(0, 3 - otherPhotos.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-50 border-r md:border-r-0 border-gray-200 last:border-r-0 md:border-b last:md:border-b-0 h-full"></div>
                ))}
            </div>
        </div>
    );
}
