
export default function CarCardProp({photo, context}){
    return(
        <div className="h-12 w-full flex items-center gap-2">
            {photo}
            <span className="font-semibold text-gray-600">{context}</span>
        </div>
    );
}
