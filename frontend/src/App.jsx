import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { MapPin, Route as RouteIcon, TrainFront } from "lucide-react";

import HowItWorks from "./components/HowItWorks";
import MapView from "./components/MapView";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteCard from "./components/RouteCard";
import SearchPanel from "./components/SearchPanel";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    let isMounted = true;

    async function fetchStations() {
      setStationsLoading(true);
      setStationsError("");
      try {
        const response = await fetch(`${API_BASE_URL}/stations`);
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          throw new Error("Failed to load stations.");
        }
        if (isMounted) {
          setStations(data);
        }
      } catch (error) {
        if (isMounted) {
          const message = error.message || "Unable to load station list.";
          setStationsError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setStationsLoading(false);
        }
      }
    }

    fetchStations();
    return () => {
      isMounted = false;
    };
  }, []);

  const routePathForMap = useMemo(() => {
    if (!result?.shortest_path) return [];
    return result.shortest_path;
  }, [result]);

  const handleReset = () => {
    setSource("");
    setDestination("");
    setResult(null);
  };

  const handleFindRoute = async () => {
    if (!source.trim() || !destination.trim()) {
      toast.error("Please select both source and destination stations.");
      return;
    }
    if (source.trim() === destination.trim()) {
      toast.error("Source and destination cannot be same.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        source: source.trim(),
        destination: destination.trim(),
      });

      const response = await fetch(`${API_BASE_URL}/route?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch route.");
      }

      setResult(data);
      toast.success("Route found successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to fetch route.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/dashboard", { replace: true });
    toast.success("Logged in successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setResult(null);
    setSource("");
    setDestination("");
    navigate("/login", { replace: true });
    toast.success("Logged out.");
  };

  const dashboard = (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} onLogout={handleLogout} />
      <main className="mx-auto flex w-full max-w-7xl gap-5 px-4 py-6 md:px-6">
        <Sidebar />
        <div className="flex-1 space-y-5">
          <motion.section
            id="home"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-card dark:border-slate-800"
          >
            <img
              src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1600&q=80"
              alt="Train running through scenic route"
              className="h-52 w-full object-cover md:h-56"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/45 via-emerald-400/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white md:p-6">
              <h2 className="text-xl font-bold md:text-2xl">Smarter Railway Route Planning</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-100 md:text-base">
                Find optimized train routes with full station-by-station visibility.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <TrainFront className="h-3.5 w-3.5" />
                  Rail Network
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <RouteIcon className="h-3.5 w-3.5" />
                  Full Route Chain
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  Station Insights
                </span>
              </div>
            </div>
          </motion.section>

          <SearchPanel
            source={source}
            destination={destination}
            setSource={setSource}
            setDestination={setDestination}
            stations={stations}
            loading={loading}
            onFindRoute={handleFindRoute}
            onReset={handleReset}
            onValidationError={(message) => toast.error(message)}
            stationLoadError={stationsError}
            stationsLoading={stationsLoading}
          />

          <section id="routes" className="space-y-4">
            {loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                <p className="text-sm text-slate-600 dark:text-slate-300">Fetching best routes...</p>
              </div>
            )}

            {result && (
              <div className="grid gap-4 md:grid-cols-2">
                <RouteCard
                  title="Shortest Route"
                  path={result.shortest_path}
                  distance={result.total_distance_km}
                  time={result.estimated_time_hours}
                  fare={`Rs. ${result.estimated_fare}`}
                  isBest
                />
                <RouteCard
                  title="Alternative Route"
                  path={result.second_best_path}
                  distance={result.second_best_distance_km}
                />
              </div>
            )}
          </section>

          <MapView routePath={routePathForMap} />
          <HowItWorks />
        </div>
      </main>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute isLoggedIn={isLoggedIn}>{dashboard}</ProtectedRoute>}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}
