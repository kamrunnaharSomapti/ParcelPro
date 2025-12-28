import { useState } from "react";
import AllUsersTable from "./AllUsersTable";
// import ChartsSection from "./ChartsSection";
import DeliveriesTable from "./DeliveriesTable";
import Header from "./Header";
import MetricsCards from "./MetricsCards";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [range, setRange] = useState("today");
    return (
        <div className="flex h-screen bg-gray-50">

            <Sidebar />

            <main className="flex-1 overflow-auto">

                <Header range={range} onRangeChange={setRange} />


                <div className="p-6 space-y-6">

                    <MetricsCards range={range} />

                    {/* <ChartsSection /> */}

                    <DeliveriesTable range={range} />

                    <AllUsersTable />

                </div>
            </main>
        </div>
    )
}
