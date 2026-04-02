"use client";

import { useCompareStore } from "@/stores/compare-store";

export default function CompareBar() {
  const items = useCompareStore((state) => state.items);
  const openDrawer = useCompareStore((state) => state.openDrawer);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const maxItems = useCompareStore((state) => state.maxItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-red-200 bg-white/95 p-3 shadow-2xl backdrop-blur md:bottom-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-lg text-red-700">
            ⚖️
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">
              {items.length} product{items.length > 1 ? "s" : ""} selected for compare
            </p>
            <p className="text-xs text-zinc-500">
              Compare up to {maxItems} products side by side
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={openDrawer}
            disabled={items.length < 2}
            className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}