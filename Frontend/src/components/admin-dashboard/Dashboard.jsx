import ChartsSection from "./ChartsSection";
import DeliveriesTable from "./DeliveriesTable";
import Header from "./Header";
import MetricsCards from "./MetricsCards";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">

            <Sidebar />

            <main className="flex-1 overflow-auto">

                <Header />


                <div className="p-6 space-y-6">

                    <MetricsCards />

                    <ChartsSection />

                    <DeliveriesTable />
                </div>
            </main>
        </div>
    )
}
