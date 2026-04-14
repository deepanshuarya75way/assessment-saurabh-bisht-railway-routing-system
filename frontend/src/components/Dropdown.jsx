import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  label,
  value,
  onChange,
  onSelect,
  options,
  excludedValue,
  placeholder,
  onValidationError,
}) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase();
    return options
      .filter((name) => name !== excludedValue)
      .filter((name) => !query || name.toLowerCase().includes(query));
  }, [options, excludedValue, value]);

  const safeSelect = useCallback(
    (station) => {
      if (station === excludedValue) {
        onValidationError?.("Source and destination cannot be the same.");
        return;
      }
      onSelect(station);
      setIsOpen(false);
    },
    [excludedValue, onSelect, onValidationError]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const firstMatch = filteredOptions[0] || value.trim();
      if (firstMatch) {
        safeSelect(firstMatch);
      } else {
        setIsOpen(false);
      }
    },
    [filteredOptions, safeSelect, value]
  );

  useEffect(() => {
    // Close the dropdown whenever user clicks outside this field.
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-30">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm outline-none ring-brand-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-40 mt-1 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-2 text-sm text-slate-500 dark:text-slate-400">No stations found.</p>
          ) : (
            filteredOptions.map((station) => (
              <button
                key={station}
                type="button"
                onClick={() => safeSelect(station)}
                className={`block w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                  station === value
                    ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-700/20 dark:text-brand-50"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {station}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
