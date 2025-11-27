import {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";

export default function Extras(){
    const {i18n} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [extras, setExtras] = useState([]);
    useEffect(() => {
        const fetchData = () => {
            axios.get('/get-extras')
                .then(res => {
                    setExtras(res.data.extras);
                })
                .catch(error => {
                    const mesaj = error.response?.data?.message || 'Bir hata oluştu.';
                    console.error(mesaj);
                });
        }
        fetchData();
        setLoading(false);
    }, []);

    if(loading)
        return <>loading...</>
    return(
        <div className={`grid grid-cols-3`}>
            {extras?.map(e => {
                return(
                    <div className={`rounded-lg shadow-lg bg-white`}>
                        <div className={``}>
                            <div>{e.name[i18n.language]}</div>
                            <div>{e.one_three_day_price}</div>
                        </div>
                        <div></div>
                    </div>
                    )
            })}
        </div>
    );
}
