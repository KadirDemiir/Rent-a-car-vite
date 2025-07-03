export default function CarModifyPhoto(){

    return(
            <div className="w-full h-full flex">
                <div className="h-full basis-3/4 flex items-center justify-center bg-white">
                    <img src="/storage/cars/volvo-xc90-2.png" alt="" />
                </div>

                <div className="h-full basis-1/4 grid grid-rows-3 bg-gray-300">
                <div className="bg-white flex items-center justify-center text-xs text-gray-700">
                    <img src="/storage/cars/volvo-xc90.png" alt="" />
                </div>
                <div className="bg-white flex items-center justify-center text-xs text-gray-700">
                    <img src="/storage/cars/volvo-xc90.png" alt="" />
                </div>
                <div className="bg-white flex items-center justify-center text-xs text-gray-700">
                    <img src="/storage/cars/volvo-xc90-2.png" alt="" />
                </div>
                </div>
            </div>
    );
}