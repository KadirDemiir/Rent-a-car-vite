export default function CarCardPhoto({photo_path, alt}){
    return(
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <img 
                src={photo_path} 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                alt={alt} 
            />
        </div>
    );
}
