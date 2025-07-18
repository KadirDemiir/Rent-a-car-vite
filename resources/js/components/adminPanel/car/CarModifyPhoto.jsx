export default function CarModifyPhoto({photos}){
    const coverPhoto = photos.find((photo) => photo.is_cover);
    const otherPhoto = photos.filter((photo) => !photo.is_cover);
    return(
            <div className="w-full h-full flex">
                <div className="h-full basis-3/4 flex items-center justify-center bg-white">
                    <img src={`/storage/${coverPhoto.photo_path}`} alt="" className={`w-full h-full`}/>
                </div>

                <div className="h-full basis-1/4 grid grid-rows-3 bg-gray-300">
                    {otherPhoto.map((oPhoto, index) => {
                        return (
                            <div key={index} className="bg-white flex items-center justify-center text-xs text-gray-700">
                                <img src={`/storage/${oPhoto.photo_path}`} alt=""/>
                            </div>
                        )
                    })}
                </div>
            </div>
    );
}
