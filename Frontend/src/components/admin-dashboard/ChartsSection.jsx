export default function ChartsSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* DELIVERY PERFORMANCE CHART */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Delivery Performance</h2>
                    <select className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last Year</option>
                    </select>
                </div>

                {/* CHART PLACEHOLDER */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center relative">
                    {/* SIMPLE SVG LINE CHART */}
                    <svg className="w-full h-full" viewBox="0 0 400 250">
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <polyline
                            points="20,180 80,140 140,150 200,120 260,130 340,100 380,110"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                        />
                        <polyline
                            points="20,180 80,140 140,150 200,120 260,130 340,100 380,110 380,240 20,240"
                            fill="url(#areaGradient)"
                        />
                    </svg>
                    <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                        <p>Mon</p>
                    </div>
                    <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                        <p>Thu</p>
                    </div>
                </div>

                {/* CHART LEGEND */}
                <div className="flex gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-600">Delivered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-600">Failed</span>
                    </div>
                </div>
            </div>

            {/* REVENUE BREAKDOWN PIE CHART */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Revenue Breakdown</h2>
                    <select className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                        <option>This Month</option>
                        <option>This Year</option>
                    </select>
                </div>

                {/* PIE CHART PLACEHOLDER */}
                <div className="h-56 flex items-center justify-center relative">
                    <svg className="w-40 h-40" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="#3b82f6" />
                        <circle cx="60" cy="60" r="38" fill="white" />
                        <path d="M 60 60 L 90 60 A 30 30 0 0 1 70 95 Z" fill="#10b981" />
                        <path d="M 60 60 L 70 95 A 30 30 0 0 1 45 80 Z" fill="#f59e0b" />
                        <path d="M 60 60 L 45 80 A 30 30 0 0 1 60 30 Z" fill="#8b5cf6" />
                        <circle cx="60" cy="60" r="20" fill="white" />
                        <text x="60" y="65" textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="bold">
                            75%
                        </text>
                    </svg>
                </div>

                {/* PIE LEGEND */}
                <div className="space-y-3 mt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-sm text-gray-700">Domestic</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-700">International</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full" />
                            <span className="text-sm text-gray-700">Express</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">10%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
