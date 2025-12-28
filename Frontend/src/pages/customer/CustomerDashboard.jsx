import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customer Dashboard</h1>
                    <p className="text-muted-foreground">Your parcels and tracking will appear here.</p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/customer/book")}
                >
                    Book a Parcel
                </button>
            </div>

            <div className="mt-6 card p-6">
                <p className="text-muted-foreground">
                    No data yet. Book your first parcel to see history and statuses here.
                </p>
            </div>
        </div>
    );
}
