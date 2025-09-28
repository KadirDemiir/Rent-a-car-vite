import Upside from './UpSide.jsx';
import LeftSide from "./LeftSide.jsx";
export default function Navbar({children}) {
    return(
        <div className={`w-full`}>
            < Upside />
            < LeftSide />
            <div className={`pl-64 pt-24 pr-4`}>
                {children}
            </div>
        </div>
    )
}
