import { router } from '@inertiajs/react';
import React from 'react';

export default function ProfileDropDown()
{
    const handleClick = (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post('/logout', {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        });
    }
    return(
        <div 
        className="w-full flex flex-col items-center justify-center bg-gray-100 shadow-lg p-2 gap-2.5 rounded-md absolute top-full"
        >
            <div className="flex items-center justify-center">My Reservation</div>
            <hr className="w-full border-gray-300"/>
            <div className="flex items-center justify-center">Profile</div>
            <hr className="w-full border-gray-300"/>
            <div className="w-full flex items-center justify-center">
                <button type="submit" onClick={handleClick} className="w-full cursor-pointer">Log Out</button>
            </div>
        </div>
    )
}