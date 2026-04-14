import { IndianRupee, MapPinned, Route, Timer, TrainFront } from "lucide-react";
import { motion } from "framer-motion";

function StepPath({ path = [] }) {
  return (
    <div className="mt-2">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Full station route ({path.length} stops)
      </p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
      {path.map((node, index) => (
        <div key={`${node}-${index}`} className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-800">
            {index + 1}. {node}
          </span>
          {index < path.length - 1 && <span className="text-slate-400">→</span>}
        </div>
      ))}
      </div>
    </div>
  );
}

export default function RouteCard({
  title,
  path,
  distance,
  time,
  fare,
  isBest = false,
}) {
  const hasPath = path && path.length > 0;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      className={`rounded-2xl border p-4 shadow-card transition ${
        isBest
          ? "border-brand-500 bg-brand-50/70 dark:bg-brand-700/10"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <TrainFront className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        {isBest && (
          <span className="rounded-full bg-brand-500 px-2 py-1 text-xs font-semibold text-white">
            Best Option
          </span>
        )}
      </div>
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Route className="h-3.5 w-3.5" />
        <span>Step-by-step rail path</span>
      </div>

      {hasPath ? (
        <StepPath path={path} />
      ) : (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          No alternative route available for this selection.
        </p>
      )}

      {hasPath && (
        <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-brand-500" />
            Distance: <strong>{distance} km</strong>
          </p>
          {time !== undefined && (
            <p className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-brand-500" />
              Estimated Time: <strong>{time} hours</strong>
            </p>
          )}
          {fare !== undefined && (
            <p className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-brand-500" />
              Fare: <strong>{fare}</strong>
            </p>
          )}
        </div>
      )}
    </motion.article>
  );
}
