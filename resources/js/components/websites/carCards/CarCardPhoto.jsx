export default function CarCardPhoto({photo_path}){
    return(
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img src={photo_path} className="h-full w-full object-cover" alt="Car Photo" />
        </div>
    );
}
