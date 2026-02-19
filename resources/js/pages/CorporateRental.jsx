import Navbar from '../components/websites/Navbar.jsx';
import MetaData from "../components/websites/MetaData.jsx";
export default function About() {
    return (
        <>
            <MetaData/>
            < Navbar />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Corporate Rental Page</h1>
                <p>Learn more about this!</p>
            </div>
        </>
    );
}
