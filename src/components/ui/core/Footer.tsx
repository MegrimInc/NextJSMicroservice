export default function Footer() {
    return (
        // This will be changed later
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                &copy; {new Date().getFullYear()} MyApp. All rights reserved.
            </div>
        </footer>
    );
}