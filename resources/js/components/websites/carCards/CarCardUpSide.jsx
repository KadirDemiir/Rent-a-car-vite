export default function CarCardUpSide({brand, model, segment}){
    return(
        <div className="w-full p-3 border-b flex justify-between items-center bg-gray-50">
            <div className="font-bold text-lg text-gray-800">{brand} {model}</div>
            <div className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{segment}</div>
        </div>
    );
}