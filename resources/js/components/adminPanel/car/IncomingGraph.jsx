import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const data = [
    { date: '2022', gelir: 75000},
    { date: '2023', gelir: 10000},
    { date: '2024', gelir: 20000 },
    { date: '2025', gelir: 30000 },
];

export default function IncomingGraph()
{
    return(
        <div>
            <span className="font-bold">Gelir durumu</span>
            <div>
                <table>
                    <thead className="table-auto w-full border border-gray-500 border-collapse mt-2">
                    <tr>
                        <th className="border border-gray-500 px-4 py-2">Yıl</th>
                        <th className="border border-gray-500 px-4 py-2">Gelir</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-gray-500 px-4 py-2">2025</td>
                        <td className="border border-gray-500 px-4 py-2">30000</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 px-4 py-2">2024</td>
                        <td className="border border-gray-500 px-4 py-2">20000</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 px-4 py-2">Toplam</td>
                        <td className="border border-gray-500 px-4 py-2">50000</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div></div>
            <div className="w-full h-96 bg-white rounded-xl p-4 shadow-md mt-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Yıllık Gelir Grafiği</h2>
                <ResponsiveContainer width="50%" height="80%" style={{marginTop: '8px'}}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="gelir" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
