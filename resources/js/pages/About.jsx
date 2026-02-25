import Navbar from '../components/websites/Navbar.jsx';
import MetaData from "../components/websites/MetaData.jsx";
import {useTranslation} from "react-i18next";
export default function About({about_info}) {
    console.log(about_info);
    const {i18n} = useTranslation();
    return (
        <>
            <MetaData/>
            < Navbar />
            <div className="p-4">
                {/*<div className="campaign-content wysiwyg-content wrap-break-words" dangerouslySetInnerHTML={{ __html: about_info.title[i18n.language] }} />
*/}        {about_info && about_info.content &&
                    <div className="campaign-content wysiwyg-content wrap-break-words"
                         dangerouslySetInnerHTML={{__html: about_info.content[i18n.language]}}/>}
            </div>
        </>
    );
}
