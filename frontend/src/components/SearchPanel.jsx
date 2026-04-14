import { Search, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import Dropdown from "./Dropdown";

export default function SearchPanel({
  source,
  destination,
  setSource,
  setDestination,
  stations,
  loading,
  onFindRoute,
  onReset,
  onValidationError,
  stationLoadError,
  stationsLoading,
}) {
  const isDisabled =
    !source.trim() || !destination.trim() || loading || stationsLoading || stations.length === 0;

  const handleSourceSelect = useCallback(
    (station) => {
      setSource(station);
    },
    [setSource]
  );

  const handleDestinationSelect = useCallback(
    (station) => {
      setDestination(station);
    },
    [setDestination]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 overflow-visible rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Search Route</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Choose source and destination stations to find optimal routes.
        </p>
      </div>

      {stationLoadError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {stationLoadError}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
        <Dropdown
          label="Source"
          value={source}
          onChange={setSource}
          onSelect={handleSourceSelect}
          options={stations}
          excludedValue={destination}
          placeholder="Search source station"
          onValidationError={onValidationError}
        />
        <Dropdown
          label="Destination"
          value={destination}
          onChange={setDestination}
          onSelect={handleDestinationSelect}
          options={stations}
          excludedValue={source}
          placeholder="Search destination station"
          onValidationError={onValidationError}
        />

        <button
          onClick={onFindRoute}
          disabled={isDisabled}
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          <Search className="h-4 w-4" />
          {loading ? "Finding..." : "Find Route"}
        </button>
        <button
          onClick={onReset}
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <XCircle className="h-4 w-4" />
          Clear
        </button>
      </div>
    </motion.section>
  );
}
