export default function CarCardPhoto({photo_path}){
    return(
        <div className="row-span-3 flex items-center justify-center">
            <img src={photo_path} className="h-full w-full object-cover" alt="Car Photo" />
        </div>
    );
}
