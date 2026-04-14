import { useEffect, useMemo, useState } from "react";
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 23.5937, lng: 78.9629 };
const PRIMARY_MAX_WAYPOINTS = 10;
const FALLBACK_MAX_WAYPOINTS = 8;

const STATION_COORDS = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Amritsar: { lat: 31.634, lng: 74.8723 },
  Jammu: { lat: 32.7266, lng: 74.857 },
  Dehradun: { lat: 30.3165, lng: 78.0322 },
  Ghaziabad: { lat: 28.6692, lng: 77.4538 },
  Meerut: { lat: 28.9845, lng: 77.7064 },
  Muzaffarnagar: { lat: 29.4727, lng: 77.7085 },
  Roorkee: { lat: 29.8543, lng: 77.888 },
  Panipat: { lat: 29.3909, lng: 76.9635 },
  Kurukshetra: { lat: 29.9695, lng: 76.8783 },
  Ambala: { lat: 30.3782, lng: 76.7767 },
  Ludhiana: { lat: 30.901, lng: 75.8573 },
  Jalandhar: { lat: 31.326, lng: 75.5762 },
  Pathankot: { lat: 32.2643, lng: 75.6421 },
  Kathua: { lat: 32.3862, lng: 75.5174 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Aligarh: { lat: 27.8974, lng: 78.088 },
  Etawah: { lat: 26.7778, lng: 79.0213 },
  Unnao: { lat: 26.5393, lng: 80.4878 },
  Patna: { lat: 25.5941, lng: 85.1376 },
  Sultanpur: { lat: 26.2648, lng: 82.0727 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Buxar: { lat: 25.5647, lng: 83.9777 },
  Ara: { lat: 25.556, lng: 84.6633 },
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Gaya: { lat: 24.7914, lng: 85.0002 },
  Koderma: { lat: 24.4686, lng: 85.5932 },
  Dhanbad: { lat: 23.7957, lng: 86.4304 },
  Asansol: { lat: 23.6739, lng: 86.9524 },
  Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Lonavala: { lat: 18.7546, lng: 73.4062 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Vapi: { lat: 20.3893, lng: 72.9106 },
  Navsari: { lat: 20.9467, lng: 72.952 },
  Vadodara: { lat: 22.3072, lng: 73.1812 },
  Bharuch: { lat: 21.7051, lng: 72.9959 },
  Anand: { lat: 22.5645, lng: 72.9289 },
  Nadiad: { lat: 22.6916, lng: 72.8634 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Vijayawada: { lat: 16.5062, lng: 80.648 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
};

export default function MapView({ routePath = [] }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [directionResults, setDirectionResults] = useState([]);
  const [mapError, setMapError] = useState("");
  const [isRouting, setIsRouting] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  const routePoints = useMemo(
    () =>
      routePath
        .map((station) => ({ station, coords: STATION_COORDS[station] }))
        .filter((item) => Boolean(item.coords)),
    [routePath]
  );

  useEffect(() => {
    if (!isLoaded || routePath.length < 2 || !window.google?.maps) {
      setDirectionResults([]);
      setMapError("");
      setIsRouting(false);
      return;
    }

    const missingStations = routePath.filter((station) => !STATION_COORDS[station]);
    if (missingStations.length > 0) {
      setDirectionResults([]);
      setMapError(`Coordinates missing for: ${missingStations.join(", ")}`);
      setIsRouting(false);
      console.error("Map route skipped due to missing station coordinates:", missingStations);
      return;
    }

    setIsRouting(true);
    setMapError("");
    const service = new window.google.maps.DirectionsService();

    const requestDirections = (segmentPath) =>
      new Promise((resolve, reject) => {
        const request = {
          origin: STATION_COORDS[segmentPath[0]],
          destination: STATION_COORDS[segmentPath[segmentPath.length - 1]],
          waypoints: segmentPath
            .slice(1, -1)
            .map((station) => ({
              location: STATION_COORDS[station],
              stopover: true,
            })),
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        };

        console.log("Directions request payload:", {
          origin: request.origin,
          destination: request.destination,
          waypointsCount: request.waypoints.length,
        });
        service.route(request, (result, status) => {
          console.log("Directions API status:", status, "waypointsCount:", request.waypoints.length);
          if (status === "OK" && result) {
            console.log("Directions API response:", result);
            resolve(result);
          } else {
            console.error("Directions API error:", status, result);
            reject(new Error(status));
          }
        });
      });

    let isActive = true;
    async function tryRouteSegments(maxWaypoints) {
      const pathSegments = buildPathSegments(routePath, maxWaypoints);
      const results = [];
      for (const segment of pathSegments) {
        const segmentResult = await requestDirections(segment);
        results.push(segmentResult);
      }
      return results;
    }

    async function fetchDirections() {
      try {
        const primaryResults = await tryRouteSegments(PRIMARY_MAX_WAYPOINTS);
        if (!isActive) return;
        setDirectionResults(primaryResults);
        setMapError("");
      } catch (primaryError) {
        console.error("Primary directions attempt failed, trying fallback:", primaryError);
        try {
          const fallbackResults = await tryRouteSegments(FALLBACK_MAX_WAYPOINTS);
          if (!isActive) return;
          setDirectionResults(fallbackResults);
          setMapError("");
        } catch (fallbackError) {
          if (!isActive) return;
          setDirectionResults([]);
          setMapError("Unable to render full road route for the selected stations.");
          console.error("All directions attempts failed:", fallbackError);
        }
      } finally {
        if (isActive) {
          setIsRouting(false);
        }
      }
    }

    fetchDirections();
    return () => {
      isActive = false;
    };
  }, [isLoaded, routePath]);

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
        Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>frontend/.env</code> to enable map
        visualization.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card dark:border-slate-800">
      {mapError && (
        <p className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
          {mapError}
        </p>
      )}
      {isRouting && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Rendering road route...
        </div>
      )}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "320px" }}
        center={DEFAULT_CENTER}
        zoom={5}
      >
        {directionResults.length > 0 ? (
          directionResults.map((directions, index) => (
            <DirectionsRenderer
              key={`directions-${index}`}
              directions={directions}
              options={{
                preserveViewport: false,
                suppressMarkers: index !== 0,
                polylineOptions: {
                  strokeColor: "#275efe",
                  strokeOpacity: 0.9,
                  strokeWeight: 5,
                },
              }}
            />
          ))
        ) : (
          routePoints.map((point) => (
            <Marker
              key={`${point.station}-${point.coords.lat}-${point.coords.lng}`}
              position={point.coords}
              title={point.station}
            />
          ))
        )}
      </GoogleMap>
    </div>
  );
}

function buildPathSegments(fullPath, maxWaypointsPerRequest) {
  const maxStationsPerSegment = maxWaypointsPerRequest + 2;
  if (fullPath.length <= maxStationsPerSegment) {
    return [fullPath];
  }

  const segments = [];
  let startIndex = 0;
  while (startIndex < fullPath.length - 1) {
    const endIndex = Math.min(startIndex + maxStationsPerSegment - 1, fullPath.length - 1);
    const segment = fullPath.slice(startIndex, endIndex + 1);
    segments.push(segment);
    if (endIndex === fullPath.length - 1) break;
    // overlap one station so the rendered route stays continuous.
    startIndex = endIndex;
  }
  return segments;
}
