import { useEffect, useRef } from "react";

export default function PlaceAutocomplete({ isLoaded, onPlaceSelect }) {
    const hostRef = useRef(null);
    const widgetRef = useRef(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!hostRef.current) return;

        let cleanup = () => { };

        (async () => {
            try {
                await window.google.maps.importLibrary("places");

                const widget = new window.google.maps.places.PlaceAutocompleteElement({
                });

                widgetRef.current = widget;
                hostRef.current.innerHTML = "";
                hostRef.current.appendChild(widget);

                const onSelect = async (event) => {
                    try {
                        const place = event.placePrediction.toPlace();
                        await place.fetchFields({
                            fields: ["displayName", "formattedAddress", "location"],
                        });

                        onPlaceSelect({
                            formatted_address: place.formattedAddress,
                            name: place.displayName,
                            geometry: { location: place.location },
                        });
                    } catch (e) {
                        console.error("Place select failed:", e);
                    }
                };

                const onError = (e) => {
                    console.error("Places widget error:", e);
                };

                widget.addEventListener("gmp-select", onSelect);
                widget.addEventListener("gmp-error", onError);

                cleanup = () => {
                    widget.removeEventListener("gmp-select", onSelect);
                    widget.removeEventListener("gmp-error", onError);
                };
            } catch (e) {
                console.error("Failed to init PlaceAutocompleteElement:", e);
            }
        })();

        return () => cleanup();
    }, [isLoaded, onPlaceSelect]);

    return <div ref={hostRef} className="w-full" />;
}
