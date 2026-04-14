import { getLikedSongs } from "@/lib/spotify";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart } from "lucide-react";

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default async function LikedPage() {
  const likedTracks = await getLikedSongs(50);

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-400 p-8 rounded-3xl shadow-2xl shadow-indigo-500/20">
          <Heart className="w-16 h-16 text-white fill-current" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Canciones que te Gustan</h1>
          <p className="text-neutral-400">Tus pistas guardadas más recientes en Spotify.</p>
        </div>
      </header>

      <div className="bg-neutral-900/30 rounded-3xl border border-neutral-800/50 p-6 overflow-hidden">
        <div className="flex flex-col gap-1">
          {likedTracks.items.map((item: any, index: number) => {
            const track = item.track;
            return (
              <Link
                key={track.id}
                href={`/dashboard/track/${track.id}`}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/80 transition-all duration-300 border border-transparent hover:border-neutral-700/50"
              >
                <div className="flex items-center justify-center w-8 text-neutral-500 font-bold group-hover:text-green-500 transition-colors">
                  {index + 1}
                </div>

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
                  <div className="flex items-center gap-2 text-sm text-neutral-400 truncate">
                    <span className="truncate">{track.artists.map((a: any) => a.name).join(", ")}</span>
                    <span className="text-neutral-700">•</span>
                    <span className="truncate">{track.album.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 min-w-[80px]">
                  <Heart className="w-5 h-5 text-green-500 fill-current" />
                  <span className="text-neutral-500 text-sm font-medium tabular-nums">
                    {formatDuration(track.duration_ms)}
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
