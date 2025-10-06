import Navbar from "../components/websites/Navbar.jsx";

export default function NotFound(){
    return(
        <div>
            <Navbar />
            <div>
                <h4 className={`w-full flex items-center justify-center bg-red-400 mt-8 p-2`}>Not Found</h4>
            </div>
        </div>
    );
}
