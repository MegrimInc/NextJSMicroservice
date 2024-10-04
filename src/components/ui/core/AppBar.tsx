export default function AppBar() {
    return (
        // This will be changed later
        <header className="bg-blue-600 text-white py-4">
            <nav className="container mx-auto flex justify-between">
                <div className="text-lg font-bold">MyApp</div>
                <ul className="flex space-x-4">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
}