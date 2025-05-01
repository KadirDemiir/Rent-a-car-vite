import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function UpSide() {
    const { auth } = usePage().props;
    const user = auth.user;
    const { post } = useForm();

const handleLogout = () => {
    post('/logout', {
        onFinish: () => window.location.reload(),
    });
};
    return (
        <div className="h-[15vh] w-full flex items-center justify-center bg-gray-100 p-2">
            <div className="w-[80%] flex items-center justify-between">
                <div><Link href="/"><img src="/storage/svg/logo.svg" alt="" className="h-12 w-12" /></Link></div>
                <div className="flex h-full min-w-[50%]">
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
                            <li>
                                {user ? (
                                <button type="button" onClick={handleLogout} className="btn btn-danger">
                                    Log Out
                                </button>
                                ) : (
                                    <Link href="/auth" className="h-10 px-4 rounded-full bg-gay-200 border border-blue-800 flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 hover:text-white">
                                        <img src="/storage/svg/profile.svg" className="bg-gray-200 rounded-2xl h-6 w-6" alt="" />
                                        <div className="font-medium">Log In</div>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}