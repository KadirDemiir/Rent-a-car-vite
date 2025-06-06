import CarIndexProp from "./CarIndexProp.jsx";
import CarIndexRequirement from "./CarIndexRequirement.jsx";
import CarIndexPhotos from "./CarIndexPhoto.jsx";


export default function CarIndexCard({car}){
    return (
      <div className="w-full grid lg:grid-cols-10 grid-cols-1 gap-4">
          <div className="lg:col-span-7 sm:col-span-1 flex flex-col gap-16">
            <CarIndexPhotos />
            <div className="w-full border-1 border-blue-800 p-4 rounded-2xl">
              <h1 className="text-xl font-extrabold">Services Included For This Vehicle</h1>
              <hr className="border-blue-800" /><br /><br />
                <ul className="list-disc ml-4 font-semibold text-gray-700">
                  <li>Zorunlu Trafik Sigortası</li>
                  <li>7/24 Yol Yardım</li>
                  <li>Rent a Car Kaskosu</li>
                  <li>Adil Yakıt Politikası</li>
                  <li>Günlük 250 KM Limit</li>
                </ul><br /><br /><br /><br />
                <h1 className="text-xl font-extrabold">Options and Extras</h1>
                <hr className="border-blue-800" /><br /><br />
                <ul className="list-disc ml-4 font-semibold text-gray-700">
                  <li>Ek Sürücü</li>
                  <li>Çocuk Koltuğu</li>
                  <li>Mesai Dışı Teslim Hizmeti</li>
                  <li>İlave 250 KM Paketi</li>
                  <li>Süper Koruma Paketi</li>
                </ul><br /><br /><br /><br />
            </div>

          </div>

        <div className="lg:col-span-3 sm-col-span-1 flex flex-col items-center gap-4">
          <CarIndexProp car={car}/>
          <CarIndexRequirement car={car} />
        </div>
      </div>

    );
}
