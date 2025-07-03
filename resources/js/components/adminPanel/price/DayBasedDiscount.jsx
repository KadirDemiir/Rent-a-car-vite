export default function DayBasedDiscount(){
    return(
        <div className={`border border-blue-500 rounded-xl`}>
            <form action="" className=" sm:grid md:grid-cols-4 gap-8 p-8 w-full">
                <h3 className={`text-l font-semibold col-span-4 flex items-center justify-center`}>Gün Bazlı İndirimler</h3>
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
                <div className={`flex items-end justify-center`}>
                    <button className={`w-32 p-2 text-white rounded-xl bg-blue-500 hover:bg-blue-700 cursor-pointer`}>Kaydet</button>
                </div>
            </form>
        </div>
    );
}
