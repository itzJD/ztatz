import { getTopTracks } from "@/lib/spotify";
import Link from "next/link";
import Image from "next/image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Play } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIME_RANGES = [
  { label: "Últimas 4 semanas", value: "short_term" },
  { label: "Últimos 6 meses", value: "medium_term" },
  { label: "Todo el tiempo", value: "long_term" },
];

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default async function TopTracksPage({
  searchParams,
}: {
  searchParams: Promise<{ time_range?: string }>;
}) {
  const { time_range = "medium_term" } = await searchParams;
  const topTracks = await getTopTracks(time_range, 50);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Top Canciones</h1>
          <p className="text-neutral-400">Tus pistas más escuchadas en Spotify.</p>
        </div>

        <nav className="flex gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          {TIME_RANGES.map((range) => (
            <Link
              key={range.value}
              href={`/dashboard/tracks?time_range=${range.value}`}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                time_range === range.value
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {range.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="bg-neutral-900/30 rounded-3xl border border-neutral-800/50 p-6 overflow-hidden">
        <div className="flex flex-col gap-1">
          {topTracks.items.map((track: any, index: number) => (
            <Link
              key={track.id}
              href={`/dashboard/track/${track.id}`}
              className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/80 transition-all duration-300 border border-transparent hover:border-neutral-700/50"
            >
              <div className="flex items-center justify-center w-8 text-neutral-500 font-bold group-hover:text-green-500 transition-colors">
                {index + 1}
              </div>

              <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl shadow-lg group-hover:shadow-green-500/10">
                <Image
                  src={track.album.images[0]?.url || "/placeholder-album.png"}
                  alt={track.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg truncate group-hover:text-green-500 transition-colors">
                  {track.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-neutral-400 truncate">
                  <span className="truncate">{track.artists.map((a: any) => a.name).join(", ")}</span>
                  <span className="text-neutral-700">•</span>
                  <span className="truncate">{track.album.name}</span>
                </div>
              </div>

              <div className="text-neutral-500 text-sm font-medium tabular-nums px-4">
                {formatDuration(track.duration_ms)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
