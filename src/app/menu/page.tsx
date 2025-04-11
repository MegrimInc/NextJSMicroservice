import ItemsTable from "@/components/ui/form/ItemsTable";

export default function MenuPage() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Manage Your Menu</h1>
            <ItemsTable />
        </div>
    );
}
