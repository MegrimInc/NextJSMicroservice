import DrinksTable from "@/components/ui/form/DrinksTable";

export default function MenuPage() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Manage Your Menu</h1>
            <DrinksTable />
        </div>
    );
}
