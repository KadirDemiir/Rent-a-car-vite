import CampaignTextEditor from "./ContentEditor.jsx";
export default function AddCampaignInfo({image, title, titleOnChange, handleImageChange, content, setOnChange, currLan}){
    return(
        <>
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                Kampanya Başlığı:
            </label>
            <input
                type="text"
                value={title}
                onChange={titleOnChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Kampanya Başlığını Girin"
            />

            <label className="block text-lg font-semibold mb-2 text-gray-700">
                Kampanya Kapak Fotoğrafı:
            </label>
            {image && (
                <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mb-4">
                    <img src={image} alt="Kapak Fotoğrafı" className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow" />
                </div>
            )}

            <div className="py-4">
                <input type="file" accept="image/*" id="file-upload" onChange={handleImageChange} className="hidden"/>
                <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 inline-block">
                    Görsel Yükle
                </label>
            </div>
            <CampaignTextEditor content={content} setContent={setOnChange} currLan={currLan}/>
        </>
    );
}
