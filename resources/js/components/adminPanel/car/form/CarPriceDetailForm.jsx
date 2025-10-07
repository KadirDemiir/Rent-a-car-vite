import {useMemo, useCallback} from "react";

export default function CarPriceDetailForm({ data, setData, errors, setErrors }) {
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const dayKeys = useMemo(() => Object.keys(data.price[1]), [data.price]);
    const parseRange = useCallback((val) => {
        if (!val || typeof val !== 'string') return null;
        const trimmed = val.trim();
        if (trimmed.endsWith("+")) {
            const num = Number(trimmed.replace("+",""));
            return isNaN(num)||num<=0?null:{min:num,max:Infinity};
        }
        if (trimmed.includes("-")) {
            const [a,b]=trimmed.split("-").map(s=>Number(s.trim()));
            return isNaN(a)||isNaN(b)||a<=0||b<=0||a>=b?null:{min:a,max:b};
        }
        return null;
    },[]);
    const validateDays = useCallback((value,dayIndex)=>{
        if(!value||value.trim()==='')return{error:"Boş olamaz"};
        const current=parseRange(value);if(!current)return{error:"Geçersiz format (örn: 1-3, 4-7, 8+)"};
        for(let i=0;i<dayKeys.length;i++){if(i===dayIndex)continue;const other=parseRange(dayKeys[i]);if(!other)continue;if(current.max===Infinity&&other.max===Infinity)return{error:"İki sonsuz değer olamaz"};if(current.min<=other.max&&current.max>=other.min)return{error:`${dayKeys[i]} ile çakışıyor`};}
        return{error:""};
    },[dayKeys,parseRange]);
    const updateDayKey=useCallback((oldKey,newKey)=>{setData(prev=>{const newPrice={};Object.entries(prev.price).forEach(([month,daysObj])=>{const updatedDays={};Object.entries(daysObj).forEach(([dayKey,value])=>{updatedDays[dayKey===oldKey?newKey:dayKey]=value;});newPrice[month]=updatedDays;});return{...prev,price:newPrice};});},[setData]);
    const handleDayKeyChange=useCallback((oldKey,newKey,index)=>{const validation=validateDays(newKey,index);setErrors(prev=>({...prev,month:{...prev.month,[index]:validation.error}}));if(!validation.error&&oldKey!==newKey){updateDayKey(oldKey,newKey);}},[validateDays,updateDayKey]);
    const addColumn=useCallback(()=>{const newKey=`new_${Date.now()}`;setData(prev=>{const newPrice={...prev.price};for(let m=1;m<=12;m++){newPrice[m]={...newPrice[m],[newKey]:""};}return{...prev,price:newPrice};});},[setData]);
    const removeColumn=useCallback((dayKey)=>{if(dayKeys.length<=1){setErrors(p=>({...p,global:"En az bir sütun bulunmalıdır"}));return;}setData(prev=>{const newPrice={};for(let m=1;m<=12;m++){const{[dayKey]:_,...rest}=prev.price[m];newPrice[m]=rest;}return{...prev,price:newPrice};});},[dayKeys,setData,setErrors]);
    const validatePrice=(e,i,dayKey)=>{let err="";if(e.target.value.trim()&&!/^\d+(\.\d{1,2})?$/.test(e.target.value))err="Geçersiz fiyat";setErrors(prev=>({...prev,price:{...prev.price,[i+1]:{...(prev.price?.[i+1]||{}),[dayKey]:err}}}));};
    return(
        <div className="w-full shadow-lg overflow-x-auto bg-white rounded-lg">
            <div className="h-full flex items-center justify-center p-4">
                <table className="table-fixed border-separate border-spacing-4 rounded-md">
                    <thead><tr className="h-auto"><th></th>{dayKeys.map((dayKey,index)=>{const error=errors.month?.[index];return(<th key={dayKey} className="p-0 m-0 relative min-w-32"><div className="relative"><button onClick={()=>removeColumn(dayKey)} className="absolute -top-3 -right-3 cursor-pointer bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600" aria-label={`Remove ${dayKey} column`}>&times;</button><input defaultValue={dayKey} className={`outline-none bg-blue-200 rounded-md w-full text-center px-2 ${error?'border-2 border-red-500':''}`} onBlur={(e)=>handleDayKeyChange(dayKey,e.target.value,index)}/></div>{error&&(<div className="text-red-500 text-xs mt-1 text-center">{error}</div>)}</th>);})}<th><button type="button" onClick={addColumn} className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600 cursor-pointer transition-colors" aria-label="Add new column">+</button></th></tr></thead>
                    <tbody>{months.map((month,i)=>(<tr key={i}><th className="bg-blue-200 rounded-md px-4 py-2 font-semibold">{month}</th>{dayKeys.map((dayKey,j)=>(<td key={`${i}-${j}`} className="rounded-lg"><input value={data.price[i+1]?.[dayKey]||''} className={`w-full border-gray-300 px-2 rounded-lg outline-none border-2 transition-all ${errors?.price?.[i+1]?.[dayKey]?'border-red-500':'focus:border-blue-500'}`} onBlur={(e)=>validatePrice(e,i,dayKey)} onChange={(e)=>{setData(prev=>({...prev,price:{...prev.price,[i+1]:{...prev.price[i+1],[dayKey]:e.target.value}}}));}}/></td>))}<td></td></tr>))}</tbody>
                </table>
            </div>
        </div>
    );
}
