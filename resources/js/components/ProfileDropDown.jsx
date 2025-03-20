import React from 'react';

export default function ProfileDropDown()
{
    return(
        <div 
        className="w-full flex flex-col items-center justify-center bg-gray-100 shadow-lg p-2 gap-2.5 rounded-md absolute top-full"
        >
            <div className="flex items-center justify-center">My Reservation</div>
            <hr className="w-full border-gray-300"/>
            <div className="flex items-center justify-center">Profile</div>
            <hr className="w-full border-gray-300"/>
            <div className="flex items-center justify-center">Log Out</div>
        </div>
    )
}