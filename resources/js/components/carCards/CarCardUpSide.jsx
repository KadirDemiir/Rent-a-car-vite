export default function CarCardUpSide({brand, model, segment}){
    return(
        <div className="row-span-1 p-2">
            <div className="text-[14px] text-blue-600 font-semibold">{segment}</div>
            <div className="font-semibold">{brand} {model}</div>
        </div>
    );
}