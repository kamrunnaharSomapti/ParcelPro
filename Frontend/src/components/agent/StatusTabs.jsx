export default function StatusTabs({ activeTab, setActiveTab, counts }) {
    const tabs = [
        { id: "all", label: `All (${counts.all || 0})` },
        { id: "Assigned", label: `Assigned (${counts.Assigned || 0})` },
        { id: "Picked Up", label: `Picked Up (${counts["Picked Up"] || 0})` },
        { id: "In Transit", label: `In Transit (${counts["In Transit"] || 0})` },
        { id: "Delivered", label: `Delivered (${counts.Delivered || 0})` },
        { id: "Failed", label: `Failed (${counts.Failed || 0})` },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 mt-4 sticky top-20 z-30 bg-gradient-to-br from-blue-50 to-indigo-100 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
