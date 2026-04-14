import { getTopArtists } from "@/lib/spotify";
import Link from "next/link";
import Image from "next/image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIME_RANGES = [
  { label: "4 sem", fullLabel: "Últimas 4 semanas", value: "short_term" },
  { label: "6 meses", fullLabel: "Últimos 6 meses", value: "medium_term" },
  { label: "Siempre", fullLabel: "Todo el tiempo", value: "long_term" },
];

export default async function TopArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ time_range?: string }>;
}) {
  const { time_range = "medium_term" } = await searchParams;
  
  let topArtists = { items: [] };
  try {
    topArtists = await getTopArtists(time_range, 50);
  } catch (error) {
    console.error("Error fetching top artists:", error);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Top Artistas</h1>
          <p className="text-neutral-400">Tus artistas más escuchados en Spotify.</p>
        </div>

        {/* Navigation with overflow on small screens */}
        <nav className="flex gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto no-scrollbar scroll-smooth">
          {TIME_RANGES.map((range) => (
            <Link
              key={range.value}
              href={`/dashboard/artists?time_range=${range.value}`}
              className={cn(
                "px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                time_range === range.value
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              <span className="hidden md:inline">{range.fullLabel}</span>
              <span className="md:hidden">{range.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {topArtists.items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {topArtists.items.map((artist: any, index: number) => (
            <Link
              key={artist.id}
              href={`/dashboard/artist/${artist.id}`}
              className="group space-y-3 md:space-y-4"
            >
              <div className="relative aspect-square overflow-hidden rounded-full shadow-2xl transition-all duration-500 group-hover:scale-105 border-4 border-transparent group-hover:border-green-500/30">
                <Image
                  src={artist.images?.[0]?.url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop"}
                  alt={artist.name}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <span className="text-white font-bold text-3xl md:text-4xl">#{index + 1}</span>
                </div>
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold text-sm md:text-lg truncate group-hover:text-green-500 transition-colors px-1">
                  {artist.name}
                </h3>
                <p className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest font-semibold truncate px-1">
                  {artist.genres?.[0] || "Artista"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 space-y-4">
          <p className="text-xl">No se encontraron artistas top.</p>
          <p className="text-sm">Es posible que necesites escuchar más música para generar estadísticas.</p>
        </div>
      )}
    </div>
  );
}
