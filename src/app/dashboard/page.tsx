import { getTopArtists, getTopTracks } from "@/lib/spotify";
import Link from "next/link";
import { ArrowRight, Music, Users } from "lucide-react";
import Image from "next/image";

export default async function Dashboard() {
  const [topArtists, topTracks] = await Promise.all([
    getTopArtists("short_term", 6),
    getTopTracks("short_term", 6),
  ]);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Tu Resumen Musical</h1>
        <p className="text-neutral-400 text-lg">Tus favoritos de las últimas 4 semanas.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold">Artistas Top</h2>
          </div>
          <Link 
            href="/dashboard/artists" 
            className="text-sm text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {topArtists.items.map((artist: any) => (
            <Link 
              key={artist.id} 
              href={`/dashboard/artist/${artist.id}`}
              className="group space-y-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 border-2 border-transparent group-hover:border-green-500/50">
                <Image
                  src={artist.images[0]?.url || "/placeholder-artist.png"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center font-medium truncate px-2 group-hover:text-green-500 transition-colors">
                {artist.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold">Canciones Top</h2>
          </div>
          <Link 
            href="/dashboard/tracks" 
            className="text-sm text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTracks.items.map((track: any) => (
            <Link 
              key={track.id} 
              href={`/dashboard/track/${track.id}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 transition-all duration-200 border border-neutral-800/50 group"
            >
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={track.album.images[0]?.url || "/placeholder-album.png"}
                  alt={track.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate group-hover:text-green-500 transition-colors">
                  {track.name}
                </p>
                <p className="text-sm text-neutral-400 truncate">
                  {track.artists.map((a: any) => a.name).join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
