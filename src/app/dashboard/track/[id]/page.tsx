import { getTrackDetails } from "@/lib/spotify";
import Image from "next/image";
import Link from "next/link";
import { Play, Calendar, Music, User } from "lucide-react";

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const track = await getTrackDetails(id);

  return (
    <div className="space-y-12">
      <header className="relative flex flex-col md:flex-row items-end gap-8 -mt-8 -mx-8 p-12 bg-gradient-to-b from-neutral-800 to-neutral-950">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden group">
          <Image
            src={track.album.images[0]?.url || "/placeholder-album.png"}
            alt={track.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Play className="w-16 h-16 text-white fill-current drop-shadow-2xl" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">Canción</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-xl">
            {track.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-lg md:text-xl font-medium">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-green-500" />
              <div className="flex gap-2">
                {track.artists.map((artist: any, i: number) => (
                  <Link 
                    key={artist.id} 
                    href={`/dashboard/artist/${artist.id}`}
                    className="text-white hover:text-green-500 underline underline-offset-4 decoration-neutral-700 transition-colors"
                  >
                    {artist.name}{i < track.artists.length - 1 ? "," : ""}
                  </Link>
                ))}
              </div>
            </div>
            <span className="text-neutral-700 hidden md:inline">•</span>
            <span className="text-neutral-300">{track.album.name}</span>
            <span className="text-neutral-700 hidden md:inline">•</span>
            <span className="text-neutral-400 tabular-nums">{formatDuration(track.duration_ms)}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight border-b border-neutral-800 pb-4">Detalles del Álbum</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-neutral-500 font-semibold uppercase tracking-wider text-xs">Fecha de Lanzamiento</p>
              <div className="flex items-center gap-3 text-white text-lg font-medium">
                <Calendar className="w-5 h-5 text-green-500" />
                {new Date(track.album.release_date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500 font-semibold uppercase tracking-wider text-xs">Popularidad</p>
              <div className="flex items-center gap-3 text-white text-lg font-medium">
                <div className="w-full bg-neutral-800 rounded-full h-2.5 max-w-[150px]">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full shadow-lg shadow-green-500/20" 
                    style={{ width: `${track.popularity}%` }}
                  />
                </div>
                <span>{track.popularity}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight border-b border-neutral-800 pb-4">Más información</h2>
          <div className="p-6 bg-neutral-900/50 rounded-3xl border border-neutral-800/50 space-y-4">
            <p className="text-neutral-400 leading-relaxed italic">
              Esta canción es parte del álbum <span className="text-white font-semibold">{track.album.name}</span>. 
              Tiene un total de <span className="text-white font-semibold">{track.album.total_tracks} pistas</span> y fue 
              lanzado bajo el sello de <span className="text-white font-semibold">{track.album.label || "Spotify"}</span>.
            </p>
            <div className="pt-4">
              <a 
                href={track.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Abrir en Spotify
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
