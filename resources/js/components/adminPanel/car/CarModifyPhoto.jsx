export default function CarModifyPhoto({ photos }) {
    const coverPhoto = photos.find((photo) => photo.is_cover);
    const otherPhotos = photos.filter((photo) => !photo.is_cover);

    return (
        <div className="w-full h-full flex">
            <div className="h-full basis-3/4 flex items-center justify-center bg-white overflow-hidden">
                {coverPhoto ? (
                    <img 
                        src={`/storage/${coverPhoto.photo_path}`} 
                        alt="Cover" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="text-gray-400">No Cover Photo</div>
                )}
            </div>

            <div className="h-full basis-1/4 grid grid-rows-3 bg-gray-100 border-l border-gray-200">
                {otherPhotos.slice(0, 3).map((photo, index) => (
                    <div key={photo.id || index} className="bg-white flex items-center justify-center overflow-hidden border-b border-gray-200 last:border-b-0">
                        <img 
                            src={`/storage/${photo.photo_path}`} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
