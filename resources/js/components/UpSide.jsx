import { Link, usePage } from '@inertiajs/react';
import {useState} from 'react';
import ProfileDropDown from './ProfileDropDown';


export default function UpSide() {
    const { auth } = usePage().props;
    const [isHovered, setIsHovered] = useState(false);
    

    return (
        <div className="h-[20vh] w-full flex items-center justify-center bg-blue-100 p-2">
            <div className="w-[80%] flex items-center justify-between">
                <div><h1>LOGO</h1></div>
                <div className="flex h-full min-w-[50%]">
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
                            <li>
                                <Link href="/">My Reservation</Link>
                            </li>
                            
                            <li>
                                { auth.user ?
                                <div 
                                className="w-[150px] flex flex-col items-center justify-center relative"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                >
                                    <div className="cursor-pointer">
                                        {auth.user.name}
                                    </div>

                                    {isHovered &&
                                        < ProfileDropDown />
                                    }
                                </div>
                                : 
                                <Link href="/auth">Sign Up</Link>
                                
                                }
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}