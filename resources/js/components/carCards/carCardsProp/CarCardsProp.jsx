
export default function CarCardProp({photo_path, context}){
    return(
        <div className="h-12 w-full flex items-center gap-2">
            <img src={photo_path} className="h-6 w-6" alt="" />
            <span>{context}</span>
        </div>
    );
}