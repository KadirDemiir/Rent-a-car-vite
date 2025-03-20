import NavBar from '../components/Navbar';

export default function Home() {
    return (
        <div>
            < NavBar />
            <div className="p-4">
                <h1 className="text-2xl font-bold text-red-900">Home Page</h1>
                <p>Welcome to the Home page!</p>
            </div>
        </div>
    );
}