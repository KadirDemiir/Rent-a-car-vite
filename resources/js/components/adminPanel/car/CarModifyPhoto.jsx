export default function CarModifyPhoto({ photos }) {
    const coverPhoto = photos.find((photo) => photo.is_cover);
    const otherPhotos = photos.filter((photo) => !photo.is_cover);

    return (
        <div className="w-full h-full flex flex-col md:flex-row">
            <div className="h-full basis-0 flex-grow md:basis-3/4 flex items-center justify-center bg-white overflow-hidden">
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

            <div className="h-20 w-full md:w-auto md:h-full md:basis-1/4 grid grid-cols-3 md:grid-cols-1 md:grid-rows-3 bg-gray-100 border-t md:border-t-0 md:border-l border-gray-200">
                {otherPhotos.slice(0, 3).map((photo, index) => (
                    <div key={photo.id || index} className="bg-white flex items-center justify-center overflow-hidden border-r md:border-r-0 border-gray-200 last:border-r-0 md:border-b last:md:border-b-0 h-full">
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
