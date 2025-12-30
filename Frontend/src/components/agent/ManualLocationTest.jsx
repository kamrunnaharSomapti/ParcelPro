import { useMemo } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
// const socket = io("http://localhost:8000");

export function ManualLocationTest({ parcelId }) {
    const [lat, setLat] = useState(23.7808875);
    const [lng, setLng] = useState(90.2792371);
    const socket = useMemo(() => {
        return io(import.meta.env.VITE_SOCKET_URL, {
            transports: ["websocket"],
        });
    }, []);

    const send = () => {
        socket.emit("agent:location:update", { parcelId, lat: Number(lat), lng: Number(lng) });
    };

    const moveNorth = () => setLat((v) => Number(v) + 0.001);
    const moveSouth = () => setLat((v) => Number(v) - 0.001);
    const moveEast = () => setLng((v) => Number(v) + 0.001);
    const moveWest = () => setLng((v) => Number(v) - 0.001);

    return (
        <div className="p-3 border rounded-lg space-y-2">
            <div className="text-sm font-semibold">Manual GPS Test</div>

            <div className="flex gap-2">
                <input className="border px-2 py-1 rounded w-1/2" value={lat} onChange={(e) => setLat(e.target.value)} />
                <input className="border px-2 py-1 rounded w-1/2" value={lng} onChange={(e) => setLng(e.target.value)} />
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={send} className="px-3 py-1 rounded bg-blue-600 text-white">Send</button>
                <button onClick={moveNorth} className="px-3 py-1 rounded border">North</button>
                <button onClick={moveSouth} className="px-3 py-1 rounded border">South</button>
                <button onClick={moveEast} className="px-3 py-1 rounded border">East</button>
                <button onClick={moveWest} className="px-3 py-1 rounded border">West</button>
            </div>
        </div>
    );
}
