export default function CarCardUpSide({brand, model, segment}){
    return(
        <div className="w-full p-3 border-b flex justify-between items-center bg-blue-100">
            <div className="font-bold text-lg text-gray-800">{brand} {model}</div>
            <div className="text-sm px-2 py-1 bg-blue-200 text-blue-800 rounded-full font-semibold">{segment}</div>
        </div>
    );
}