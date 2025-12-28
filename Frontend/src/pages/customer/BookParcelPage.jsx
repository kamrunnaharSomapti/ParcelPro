import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";
import Field from "../../components/shared/Field";
import PlaceAutocomplete from "../../components/shared/PlaceAutocomplete";

const MAP_LIBRARIES = ["places"];
const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka
const MAP_CONTAINER_STYLE = { width: "100%", height: "320px" };

const safeNumber = (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

async function reverseGeocode({ lat, lng, apiKey }) {
    const url =
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}` +
        `&key=${apiKey}&language=en`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") {
        console.error("Geocode failed:", data.status, data.error_message);
        return "";
    }

    // Prefer a "street_address" result if present, else first result
    const best =
        data.results.find(r => r.types?.includes("street_address")) ||
        data.results.find(r => r.types?.includes("premise")) ||
        data.results[0];

    return best?.formatted_address || "";
}

export default function BookParcelPage() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    // Trim the key to prevent InvalidKeyMapError due to spaces
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY?.trim();

    // Debugging: Alert if key doesn't look like an API key (starts with AIza)
    useEffect(() => {
        if (apiKey && !apiKey.startsWith("AIza")) {
            console.error("Invalid Google Maps API Key format. It should start with 'AIza'. Current key:", apiKey);
            // alert("Warning: Your Google Maps API Key does not appear to be valid (should start with AIza). Check your .env file.");
        }
    }, [apiKey]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: MAP_LIBRARIES,
    });

    const [useCurrentPickup, setUseCurrentPickup] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [mapMsg, setMapMsg] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            parcelDetails: { weight: 1, type: "Electronics", description: "" },
            pickupLocation: { address: "", lat: "", lng: "" },
            deliveryLocation: { address: "", lat: "", lng: "" },
            paymentDetails: { method: "COD", amount: 0 },
        },
    });

    const paymentMethod = watch("paymentDetails.method");

    // Watch lat/lng to render markers
    const pickupLat = safeNumber(watch("pickupLocation.lat"));
    const pickupLng = safeNumber(watch("pickupLocation.lng"));
    const deliveryLat = safeNumber(watch("deliveryLocation.lat"));
    const deliveryLng = safeNumber(watch("deliveryLocation.lng"));

    const pickupMarker = useMemo(() => {
        if (pickupLat === undefined || pickupLng === undefined) return null;
        return { lat: pickupLat, lng: pickupLng };
    }, [pickupLat, pickupLng]);

    const deliveryMarker = useMemo(() => {
        if (deliveryLat === undefined || deliveryLng === undefined) return null;
        return { lat: deliveryLat, lng: deliveryLng };
    }, [deliveryLat, deliveryLng]);

    const mapCenter = useMemo(() => {
        return pickupMarker || deliveryMarker || DEFAULT_CENTER;
    }, [pickupMarker, deliveryMarker]);

    const handleUseCurrentPickup = async (checked) => {
        setUseCurrentPickup(checked);
        setMapMsg("");

        if (!checked) return;

        if (!navigator.geolocation) {
            setError("pickupLocation.address", { type: "manual", message: "Geolocation not supported in this browser." });
            return;
        }

        setGeoLoading(true);
        clearErrors("pickupLocation.address");

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    setValue("pickupLocation.lat", lat);
                    setValue("pickupLocation.lng", lng);

                    // Try to auto-fill address (optional)
                    if (apiKey) {
                        const addr = await reverseGeocode({ lat, lng, apiKey });
                        if (addr) setValue("pickupLocation.address", addr);
                        else setValue("pickupLocation.address", `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
                    }

                    setMapMsg("Pickup location captured.");
                } catch (e) {
                    setMapMsg("Pickup coordinates captured, but address auto-fill failed.");
                } finally {
                    setGeoLoading(false);
                }
            },
            () => {
                setGeoLoading(false);
                setError("pickupLocation.address", { type: "manual", message: "Location permission denied." });
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    const handleDeliveryPlaceSelected = (place) => {
        if (!place) return;

        const address = place.formatted_address || place.name || "";
        // place.geometry.location is a LatLng object from the API
        const lat = place.geometry?.location?.lat?.();
        const lng = place.geometry?.location?.lng?.();

        if (address) setValue("deliveryLocation.address", address);
        if (lat && lng) {
            setValue("deliveryLocation.lat", lat);
            setValue("deliveryLocation.lng", lng);
            setMapMsg("Delivery location selected from search.");
        }
    };

    const handleMapClick = async (e) => {
        // Click-to-set delivery point (very useful)
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setValue("deliveryLocation.lat", lat);
        setValue("deliveryLocation.lng", lng);

        try {
            if (apiKey) {
                const addr = await reverseGeocode({ lat, lng, apiKey });

                if (addr) {
                    setValue("pickupLocation.address", addr, { shouldValidate: true, shouldDirty: true });
                } else {
                    // Better fallback text than lat/lng
                    setValue("pickupLocation.address", "Current Location (GPS)", { shouldValidate: true, shouldDirty: true });
                }
            } else {
                setValue("pickupLocation.address", "Current Location (GPS)", { shouldValidate: true, shouldDirty: true });
            }
            setMapMsg("Delivery location selected from map.");
        } catch {
            setMapMsg("Delivery coordinates selected, address auto-fill failed.");
        }
    };


    const onSubmit = async (data) => {
        try {

            clearErrors?.("root.server");


            const pickupAddress = [data.pickupHouse, data.pickupRoad, data.pickupLocation?.address]
                .filter((v) => typeof v === "string" ? v.trim() : v)
                .join(", ");

            const weight = safeNumber(data?.parcelDetails?.weight);
            const amount = safeNumber(data?.paymentDetails?.amount);
            const method = data?.paymentDetails?.method;

            if (!pickupAddress) {
                setError("pickupLocation.address", { type: "manual", message: "Pickup address is required." });
                return;
            }

            if (!data?.deliveryLocation?.address) {
                setError("deliveryLocation.address", { type: "manual", message: "Delivery address is required." });
                return;
            }

            if (!weight || weight <= 0) {
                setError("parcelDetails.weight", { type: "manual", message: "Weight must be greater than 0." });
                return;
            }

            if (amount === undefined || amount < 0) {
                setError("paymentDetails.amount", { type: "manual", message: "Amount is required and cannot be negative." });
                return;
            }

            if (!["COD", "PREPAID"].includes(method)) {
                setError("paymentDetails.method", { type: "manual", message: "Invalid payment method." });
                return;
            }


            const payload = {
                parcelDetails: {
                    weight,
                    type: data.parcelDetails.type,
                    description: data.parcelDetails.description || "",
                },
                pickupLocation: {
                    address: pickupAddress,
                    lat: safeNumber(data.pickupLocation?.lat),
                    lng: safeNumber(data.pickupLocation?.lng),
                },
                deliveryLocation: {
                    address: data.deliveryLocation.address,
                    lat: safeNumber(data.deliveryLocation?.lat),
                    lng: safeNumber(data.deliveryLocation?.lng),
                },
                paymentDetails: {
                    method,
                    amount,
                },
            };

            const res = await axiosPrivate.post("/parcels/book", payload);
            console.log("Booked parcel:", res?.data);

            navigate("/customer", { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to book parcel. Please try again.";
            setError("root.server", { type: "server", message: msg });
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold">Book a Parcel</h1>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Parcel Details */}
                <div className="card p-5 space-y-4">
                    <h2 className="font-semibold">Parcel Details</h2>

                    <Field label="Type" error={errors?.parcelDetails?.type}>
                        <select className="input" {...register("parcelDetails.type", { required: "Type is required" })}>
                            <option value="Electronics">Electronics</option>
                            <option value="Document">Document</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Fragile">Fragile</option>
                            <option value="Other">Other</option>
                        </select>
                    </Field>

                    <Field label="Weight (kg)" error={errors?.parcelDetails?.weight}>
                        <input
                            type="number"
                            className="input"
                            step="any"
                            {...register("parcelDetails.weight", {
                                required: "Weight is required",
                                min: { value: 0.1, message: "Min 0.1kg" },
                            })}
                        />
                    </Field>

                    <Field label="Description (optional)" error={errors?.parcelDetails?.description}>
                        <input className="input" placeholder="Laptop / Documents..." {...register("parcelDetails.description")} />
                    </Field>
                </div>

                {/* Pickup Location */}
                <div className="card p-5 space-y-4">
                    <h2 className="font-semibold">Pickup Location</h2>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={useCurrentPickup}
                            onChange={(e) => handleUseCurrentPickup(e.target.checked)}
                        />
                        <span>Use my current location</span>
                        {geoLoading ? <span className="text-sm opacity-70">Getting GPS…</span> : null}
                    </div>

                    <Field label="Pickup Address" error={errors?.pickupLocation?.address}>
                        <textarea
                            className="input min-h-[80px]"
                            placeholder="House/Road/Area, City"
                            {...register("pickupLocation.address", { required: "Pickup address is required" })}
                        />
                    </Field>

                    {/* Keep hidden fields for payload */}
                    <input type="hidden" {...register("pickupLocation.lat")} />
                    <input type="hidden" {...register("pickupLocation.lng")} />
                </div>

                {/* Delivery Location */}
                <div className="card p-5 space-y-4">
                    <h2 className="font-semibold">Delivery Location</h2>

                    {isLoaded ? (
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium block mb-1">Search Delivery Address</label>
                                <PlaceAutocomplete isLoaded={isLoaded} onPlaceSelect={handleDeliveryPlaceSelected} />
                                <p className="text-xs opacity-70 mt-1">
                                    Tip: You can also click on the map to set delivery location.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="House / Flat (optional)">
                                    <input className="input" placeholder="House 12, Flat B2" {...register("pickupHouse")} />
                                </Field>
                                <Field label="Road / Block (optional)">
                                    <input className="input" placeholder="Road 5, Block C" {...register("pickupRoad")} />
                                </Field>
                            </div>


                            <Field label="Delivery Address" error={errors?.deliveryLocation?.address}>
                                <textarea
                                    className="input min-h-[80px]"
                                    placeholder="Auto-filled after selecting on map/search"
                                    {...register("deliveryLocation.address", { required: "Delivery address is required" })}
                                />
                            </Field>

                            {/* Hidden fields for payload */}
                            <input type="hidden" {...register("deliveryLocation.lat")} />
                            <input type="hidden" {...register("deliveryLocation.lng")} />

                            <div className="rounded-lg overflow-hidden border">
                                <GoogleMap
                                    mapContainerStyle={MAP_CONTAINER_STYLE}
                                    center={mapCenter}
                                    zoom={13}
                                    onClick={handleMapClick}
                                >
                                    {pickupMarker ? <Marker position={pickupMarker} label="P" /> : null}
                                    {deliveryMarker ? <Marker position={deliveryMarker} label="D" /> : null}
                                </GoogleMap>
                            </div>

                            {mapMsg ? <p className="text-sm opacity-80">{mapMsg}</p> : null}
                        </div>
                    ) : (
                        <Field label="Delivery Address" error={errors?.deliveryLocation?.address}>
                            <textarea
                                className="input min-h-[80px]"
                                {...register("deliveryLocation.address", { required: "Delivery address is required" })}
                            />
                        </Field>
                    )}
                </div>

                {/* Payment */}
                <div className="card p-5 space-y-4">
                    <h2 className="font-semibold">Payment</h2>

                    <Field label="Method" error={errors?.paymentDetails?.method}>
                        <select className="input" {...register("paymentDetails.method", { required: "Payment method is required" })}>
                            <option value="COD">COD</option>
                            <option value="PREPAID">PREPAID</option>
                        </select>
                    </Field>

                    <Field
                        label={paymentMethod === "COD" ? "COD Amount" : "Paid Amount"}
                        error={errors?.paymentDetails?.amount}
                    >
                        <input
                            type="number"
                            className="input"
                            step="any"
                            {...register("paymentDetails.amount", {
                                required: "Amount is required",
                                min: { value: 0, message: "Amount can't be negative" },
                            })}
                        />
                    </Field>

                    <p className="text-xs opacity-70">
                        {paymentMethod === "COD"
                            ? "Customer pays on delivery."
                            : "Payment already completed (demo)."}
                    </p>
                </div>

                {/* Server Error */}
                {errors?.root?.server?.message ? (
                    <p className="text-sm text-red-500">{errors.root.server.message}</p>
                ) : null}

                <button className="btn btn-primary w-full h-11" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
}
