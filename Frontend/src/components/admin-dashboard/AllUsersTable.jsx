import { ChevronRight, MapPin } from "lucide-react"
import { useAxiosPrivate } from "../../api/useAxiosPrivate";
import { useEffect, useState } from "react";

const roleConfig = {
    admin: { bg: "bg-purple-100", text: "text-purple-800" },
    agent: { bg: "bg-blue-100", text: "text-blue-800" },
    customer: { bg: "bg-green-100", text: "text-green-800" },
}

export default function AllUsersTable() {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

    const [loading, setLoading] = useState(false);
    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/users", {
                params: { page, limit: meta.limit },
            });

            setUsers(res.data?.data || []);
            setMeta((m) => ({ ...m, ...(res.data?.meta || {}), page }));
        } catch (err) {
            console.error("Users load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showingFrom = (meta.page - 1) * meta.limit + 1;
    const showingTo = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* TABLE HEADER */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">All Users</h2>
                {loading && <span className="text-sm text-gray-500">Loading...</span>}
                {!loading && (
                    <p className="text-sm text-gray-500">
                        Showing {showingFrom} to {showingTo} of {meta.total} users
                    </p>
                )}
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                            const role = user.role || "customer";
                            const cfg = roleConfig[role] || roleConfig.customer;

                            return (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} capitalize`}>
                                            {role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.currentLocation ? (
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {user.currentLocation.lat.toFixed(4)}, {user.currentLocation.lng.toFixed(4)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-sm text-gray-500" colSpan={5}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                    {meta.total === 0
                        ? "Showing 0 results"
                        : `Showing ${showingFrom}-${showingTo} of ${meta.total} users`}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={meta.page <= 1 || loading}
                        onClick={() => fetchUsers(meta.page - 1)}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                        Prev
                    </button>

                    <button
                        disabled={meta.page * meta.limit >= meta.total || loading}
                        onClick={() => fetchUsers(meta.page + 1)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}