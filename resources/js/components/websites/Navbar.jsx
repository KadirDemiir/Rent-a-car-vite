import { useState } from 'react';
import { Link } from '@inertiajs/react'; // Add Link
import UpSide from './UpSide.jsx';
import DownSide from './DownSide.jsx';
import { Menu, X, User, CarFront } from 'lucide-react'; // Add User, CarFront

const Navbar = () => {
    // Separate states for left (nav) and right (user) menus
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        if (!isNavOpen) setIsUserOpen(false); // Close user menu if opening nav
    };

    const toggleUser = () => {
        setIsUserOpen(!isUserOpen);
        if (!isUserOpen) setIsNavOpen(false); // Close nav menu if opening user
    };

    return (
        <div className="flex flex-col w-full relative">
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                {/* Left: DownSide Toggle */}
                <button 
                    onClick={toggleNav}
                    className="p-2 text-gray-700 hover:text-blue-800 transition-colors"
                    aria-label="Toggle Navigation"
                >
                    {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Center: Logo */}
                <Link href="/" className="text-blue-800">
                    <CarFront size={32}/>
                </Link>

                {/* Right: UpSide Toggle */}
                <button 
                    onClick={toggleUser}
                    className={`p-2 transition-colors ${isUserOpen ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
                    aria-label="Toggle User Menu"
                >
                    <User size={24} />
                </button>
            </div>

            {/* UpSide (User Actions) - Controlled by isUserOpen on mobile */}
            <UpSide isMobileMenuOpen={isUserOpen} />

            {/* DownSide (Navigation) - Controlled by isNavOpen on mobile */}
            <DownSide isMobileMenuOpen={isNavOpen} />
        </div>
    );
};

export default Navbar;
