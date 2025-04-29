import CarIndexPropComp from "./carIndexComp/CarIndexPropComp";

export default function CarIndexRequirement({car}){ 
    return (
        <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md w-full border-1 border-blue-600">
            <div className="col-span-2 flex justify-center font-bold text-xl">Requirements</div>

            < CarIndexPropComp photo_path={"/storage/svg/requirements/calendar.svg"} title={"Min age"} content={"23"}/>
            < CarIndexPropComp photo_path={"/storage/svg/requirements/steering-wheel.svg"} title={"Experience"} content={"3"}/>
            < CarIndexPropComp photo_path={"/storage/svg/requirements/assurance.svg"} title={"Deposit"} content={"6000 TL"}/>
        </div>
    );
}