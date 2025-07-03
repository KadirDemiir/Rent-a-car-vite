import Td from "../table/Td.jsx";

export default function DiscountList({data, isActive, }){
    const TDclass = "border border-gray-500 px-4 py-2";
    const header = ["İndirim Tipi", "Etkilenen Araç(lar)", "İndirim Tutarı/Oranı", "Başlangıç", "Bitiş", "Durum"];
    return(
        <table className={`w-full`}>
            <thead>
            <tr>
                < Td contents={header} cls={TDclass} as={"th"}/>
            </tr>
            </thead>
            <tbody>
            {data.map((dt) => {
                const hedef = dt.target_type === "car"
                    ? (dt.car?.brand || "Marka Yok")
                    : dt.target_type === "segment"
                        ? (dt.segment_name + " araçlar" || "Segment Yok")
                        : "Tümü";
                const indirim = dt.discount_type === "fixed"
                    ? dt.discount_value + "₺"
                    : (dt.discount_value * 100) + "%";

                if(isActive !== "all" && isActive !== dt.status)
                    return
                else{

                    return (
                        <tr key={dt.id}>
                            <Td contents={[
                                dt.target_type,
                                hedef,
                                indirim,
                                dt.start_date,
                                dt.end_date,
                                dt.status
                            ]}
                                cls={TDclass} />
                        </tr>
                    );
                }
            })}
            </tbody>
        </table>
    );
}
