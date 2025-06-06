export default function PastRentalRecords()
{
    return(
        <div>
            <div className="space-x-4">
                <span className="font-bold">Aracın Kiralama Geçmişi</span>
                <span className="text-sm font-thin">(Detaylı bilgi tıklayınız için tıkalyınız)</span>
            </div>
            <table className="table-auto w-full border border-gray-500 border-collapse mt-2">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-500 px-4 py-2">Ad</th>
                    <th className="border border-gray-500 px-4 py-2">Soyad</th>
                    <th className="border border-gray-500 px-4 py-2">Numara</th>
                    <th className="border border-gray-500 px-4 py-2">Alış</th>
                    <th className="border border-gray-500 px-4 py-2">Alış Yeri</th>
                    <th className="border border-gray-500 px-4 py-2">İade</th>
                    <th className="border border-gray-500 px-4 py-2">İade Yeri</th>
                    <th className="border border-gray-500 px-4 py-2">Ekstra Tutar</th>
                    <th className="border border-gray-500 px-4 py-2">Toplam Tutar</th>
                    <th className="border border-gray-500 px-4 py-2">Ödeme Yöntemi</th>
                    <th className="border border-gray-500 px-4 py-2">Ödeme Durumu</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-gray-500 px-4 py-2">Ali</td>
                    <td className="border border-gray-500 px-4 py-2">Yılmaz</td>
                    <td className="border border-gray-500 px-4 py-2">0555 123 45 67</td>
                    <td className="border border-gray-500 px-4 py-2">01.01.2024</td>
                    <td className="border border-gray-500 px-4 py-2">İstanbul</td>
                    <td className="border border-gray-500 px-4 py-2">05.01.2024</td>
                    <td className="border border-gray-500 px-4 py-2">Ankara</td>
                    <td className="border border-gray-500 px-4 py-2">1000</td>
                    <td className="border border-gray-500 px-4 py-2">4.200₺</td>
                    <td className="border border-gray-500 px-4 py-2">Kredi Kartı</td>
                    <td className="border border-gray-500 px-4 py-2 text-green-600 font-semibold">Ödendi</td>
                </tr>
                <tr>
                    <td className="border border-gray-500 px-4 py-2">Veli</td>
                    <td className="border border-gray-500 px-4 py-2">Yılar</td>
                    <td className="border border-gray-500 px-4 py-2">0555 123 45 67</td>
                    <td className="border border-gray-500 px-4 py-2">01.01.2024</td>
                    <td className="border border-gray-500 px-4 py-2">Ankara</td>
                    <td className="border border-gray-500 px-4 py-2">05.01.2024</td>
                    <td className="border border-gray-500 px-4 py-2">Nevşehir</td>
                    <td className="border border-gray-500 px-4 py-2">500</td>
                    <td className="border border-gray-500 px-4 py-2">4.700₺</td>
                    <td className="border border-gray-500 px-4 py-2">Kredi Kartı</td>
                    <td className="border border-gray-500 px-4 py-2 text-green-600 font-semibold">Ödendi</td>
                </tr>
                </tbody>
            </table>
        </div>

    );
}
