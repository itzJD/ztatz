import { getRecentlyPlayed } from "@/lib/spotify";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock } from "lucide-react";

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${days} d`;
}

export default async function RecentPage() {
  const recentTracks = await getRecentlyPlayed(50);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Escuchado Recientemente</h1>
        <p className="text-neutral-400">Tus últimas 50 canciones en Spotify.</p>
      </header>

      <div className="bg-neutral-900/30 rounded-3xl border border-neutral-800/50 p-6 overflow-hidden">
        <div className="flex flex-col gap-1">
          {recentTracks.items.map((item: any, index: number) => {
            const track = item.track;
            return (
              <Link
                key={`${track.id}-${item.played_at}`}
                href={`/dashboard/track/${track.id}`}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/80 transition-all duration-300 border border-transparent hover:border-neutral-700/50"
              >
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
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
                  <p className="text-sm text-neutral-400 truncate">
                    {track.artists.map((a: any) => a.name).join(", ")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 px-4 min-w-[100px]">
                  <span className="text-neutral-300 text-sm font-medium tabular-nums">
                    {formatDuration(track.duration_ms)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.played_at)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
