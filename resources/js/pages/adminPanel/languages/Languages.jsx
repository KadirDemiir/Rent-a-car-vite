import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../components/adminPanel/table/Td.jsx";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function Language({languages}){
    const {i18n, t} = useTranslation();
    const handleClick = (id) => {
        router.visit(`/aa/adminpanel/languages/${id}`, { method: 'get' })
    }
    return(
      <div className={`w-full`}>
          <Navbar >
              <h4>{t("adminpanel.languages.languages")}</h4><hr/><br/>
              <table className={`w-full`}>
                  <thead>
                    <tr>
                        <Td contents={[t("adminpanel.languages.language_id"), t("adminpanel.languages.language_code"), t("adminpanel.languages.language_name"), t("adminpanel.languages.status")]} as='th'/>
                    </tr>
                  </thead>
                  <tbody>
                  {languages?.map(lang => (
                      <tr key={lang.id} onClick={() => handleClick(lang.id)} className={`cursor-pointer`}>
                          <Td contents={[lang.id, lang.code, lang.name, <span className={`${lang.status === 'active' ? 'text-green-500' :  'text-red-500'} `}>{lang.status === 'active' ? 'active' : 'pasive' ?  'pasive' : 'test'}</span>]} />
                      </tr>
                  ))}
                  </tbody>
              </table>
              <div className={`w-full flex justify-end mt-4`}>
                  <Link href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.languages")}/${t("address.add")}`} className={`py-1 px-4 bg-green-500 rounded-lg text-white hover:bg-green-600 cursor-pointer`}>{t("adminpanel.languages.add_new")}</Link>
              </div>
          </Navbar>
      </div>
    );
}
