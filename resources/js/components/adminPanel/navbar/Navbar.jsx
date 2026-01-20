import { useState } from 'react';
import Upside from './UpSide.jsx';
import LeftSide from "./LeftSide.jsx";
export default function Navbar({children}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return(
        <div className={`w-full min-h-screen bg-gray-50`}>
            < Upside onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            < LeftSide isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className={`pt-24 px-4 pb-4 md:pl-64 transition-all duration-300`}>
                {children}
            </div>
        </div>
    )
}
