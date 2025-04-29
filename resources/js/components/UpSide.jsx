import { Link } from '@inertiajs/react';

export default function UpSide() {
    return (
        <div className="h-[20vh] w-full flex items-center justify-center bg-gray-100 p-2">
            <div className="w-[80%] flex items-center justify-between">
                <div><h1>LOGO</h1></div>
                <div className="flex h-full min-w-[50%]">
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
                            <li>
                                <Link href="/">My Reservation</Link>
                            </li>
                            
                            <li>
                                <Link href="/auth">Sign Up</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}