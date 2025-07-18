export default function DayBasedDiscount(){
    return(
            <form action="" className=" sm:grid md:grid-cols-3 gap-8">
                <h3 className={`text-l font-semibold col-span-3 flex items-center justify-center`}>Gün Bazlı İndirimler</h3>
                <div>
                    <div>7 Günlük Kiralama: </div>

                    <input type="text" className={`w-full p-2 border border-gray-500 rounded-md`}/>
                </div>
                <div>
                    <div>14 Günlük Kiralama: </div>
                    <input type="text" className={`w-full p-2 border border-gray-500 rounded-md`}/>
                </div>
                <div>
                    <div>30 Günlük Kiralama:</div>

                    <input type="text" className="w-full p-2 border border-gray-500 rounded-md"/>
                </div>
            </form>
    );
}
