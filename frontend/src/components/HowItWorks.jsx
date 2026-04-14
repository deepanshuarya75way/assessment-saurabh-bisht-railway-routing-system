import { BrainCircuit } from "lucide-react";

export default function HowItWorks() {
  return (
    <section
      id="about"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-2 flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-brand-500" />
        <h2 className="text-lg font-semibold">How it works</h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        Stations are modeled as graph nodes and train links are edges with distance as weight.
        Dijkstra&apos;s algorithm starts at the source station and keeps selecting the nearest
        unvisited node, updating shortest known distances until the destination is reached. This
        guarantees the shortest route in a weighted graph with non-negative distances.
      </p>
    </section>
  );
}
