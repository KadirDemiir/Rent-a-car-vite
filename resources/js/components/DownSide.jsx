import { Link } from '@inertiajs/react';

export default function DownSide() {
    return (
        <nav className="bg-blue-600 h-20 flex items-center justify-center">
        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/cars" className="h-full w-full text-white flex items-center justify-center">Cars</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex-1 flex items-center justify-center rounded-md">
                <Link href="/locations" className="h-full w-full text-white flex items-center justify-center">Locations</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/campaigns" className="h-full w-full text-white flex items-center justify-center">Campaigns</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/carporateRental" className="h-full w-full text-white flex items-center justify-center">Corporate Car Rental</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/about" className="h-full w-full text-white flex items-center justify-center">About Us</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/blog" className="h-full w-full text-white flex items-center justify-center">Blog</Link>
            </li>
        </ul>
    </nav>
    );
}