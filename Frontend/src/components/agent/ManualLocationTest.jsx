import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export function ManualLocationTest({ parcelId }) {
    // Center-ish points (good for demo; you can overwrite anytime)
    const PRESETS = {
        mohammadpur: { lat: 23.765844, lng: 90.358361 },
        tejgaon: { lat: 23.759739, lng: 90.392418 },
    };

    const [lat, setLat] = useState(PRESETS.mohammadpur.lat);
    const [lng, setLng] = useState(PRESETS.mohammadpur.lng);
    const [step, setStep] = useState(0.001); // ~100m-ish per click
    const [status, setStatus] = useState("");

    const socket = useMemo(() => {
        return io(import.meta.env.VITE_SOCKET_URL, {
            transports: ["websocket"],
        });
    }, []);

    useEffect(() => {
        // cleanup so you don’t create ghost connections
        return () => {
            try {
                socket.disconnect();
            } catch { }
        };
    }, [socket]);

    const nLat = Number(lat);
    const nLng = Number(lng);
    const nStep = Number(step) || 0.001;

    const send = () => {
        setStatus("");
        if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) {
            setStatus("❌ Invalid lat/lng. Example: 23.7658, 90.3583");
            return;
        }

        socket.emit("agent:location:update", {
            parcelId,
            lat: nLat,
            lng: nLng,
        });

        setStatus("✅ Sent location update");
    };

    const moveNorth = () => setLat((v) => Number(v) + nStep);
    const moveSouth = () => setLat((v) => Number(v) - nStep);
    const moveEast = () => setLng((v) => Number(v) + nStep);
    const moveWest = () => setLng((v) => Number(v) - nStep);

    const applyPreset = (key) => {
        const p = PRESETS[key];
        setLat(p.lat);
        setLng(p.lng);
        setStatus(`✅ Loaded preset: ${key}`);
    };

    const openInGoogleMaps = () => {
        // Works without any API key
        const url = `https://www.google.com/maps?q=${nLat},${nLng}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const copyCoords = async () => {
        try {
            await navigator.clipboard.writeText(`${nLat}, ${nLng}`);
            setStatus("✅ Copied: lat, lng");
        } catch {
            setStatus("❌ Copy failed (browser blocked clipboard).");
        }
    };

    return (
        <div className="p-3 border rounded-lg space-y-2">
            <div className="text-sm font-semibold">Manual GPS Test</div>

            <div className="flex gap-2">
                <input
                    className="border px-2 py-1 rounded w-1/2"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude (e.g. 23.7658)"
                />
                <input
                    className="border px-2 py-1 rounded w-1/2"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Longitude (e.g. 90.3583)"
                />
            </div>

            <div className="flex gap-2">
                <input
                    className="border px-2 py-1 rounded w-1/2"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    placeholder="Step (e.g. 0.001)"
                />
                <div className="w-1/2 text-xs opacity-70 flex items-center">
                    Tip: 0.001 ≈ ~100m
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={send} className="px-3 py-1 rounded bg-blue-600 text-white">
                    Send
                </button>

                <button onClick={() => applyPreset("mohammadpur")} className="px-3 py-1 rounded border">
                    Mohammadpur
                </button>
                <button onClick={() => applyPreset("tejgaon")} className="px-3 py-1 rounded border">
                    Tejgaon
                </button>

                <button onClick={openInGoogleMaps} className="px-3 py-1 rounded border">
                    Open Map
                </button>
                <button onClick={copyCoords} className="px-3 py-1 rounded border">
                    Copy lat,lng
                </button>

                <button onClick={moveNorth} className="px-3 py-1 rounded border">North</button>
                <button onClick={moveSouth} className="px-3 py-1 rounded border">South</button>
                <button onClick={moveEast} className="px-3 py-1 rounded border">East</button>
                <button onClick={moveWest} className="px-3 py-1 rounded border">West</button>
            </div>

            {status ? <div className="text-xs opacity-80">{status}</div> : null}
        </div>
    );
}
