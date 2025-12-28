
const agents = [
    { name: "Mike Chan", avatar: "MC", successRate: "98%" },
    { name: "Alex Kumar", avatar: "AK", successRate: "96%" },
    { name: "James Lee", avatar: "JL", successRate: "95%" },
    { name: "Tom Wilson", avatar: "TW", successRate: "94%" },
]

export default function AgentStats() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Agents by Success Rate</h3>
            <div className="space-y-3">
                {agents.map((agent, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                                {agent.avatar}
                            </div>
                            <span className="text-sm text-gray-700">{agent.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{agent.successRate}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
