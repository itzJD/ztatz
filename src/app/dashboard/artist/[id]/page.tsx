import { getArtistDetails, getArtistTopTracks, getArtistAlbums } from "@/lib/spotify";
import Image from "next/image";
import Link from "next/link";
import { Play, Users } from "lucide-react";

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [artist, topTracks, albums] = await Promise.all([
    getArtistDetails(id),
    getArtistTopTracks(id),
    getArtistAlbums(id),
  ]);

  return (
    <div className="space-y-12">
      <header className="relative h-[400px] -mt-8 -mx-8 overflow-hidden">
        <Image
          src={artist.images[0]?.url || "/placeholder-artist.png"}
          alt={artist.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500 w-fit rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">
            Artista Verificado
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            {artist.name}
          </h1>
          <div className="flex items-center gap-6 text-neutral-200">
            <span className="flex items-center gap-2 font-medium">
              <Users className="w-5 h-5 text-green-500" />
              {artist.followers.total.toLocaleString()} Seguidores
            </span>
            <span className="text-neutral-500">•</span>
            <span className="bg-neutral-800/80 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold capitalize">
              {artist.genres.slice(0, 3).join(", ")}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Populares</h2>
          <div className="bg-neutral-900/30 rounded-3xl border border-neutral-800/50 overflow-hidden">
            {topTracks.tracks.slice(0, 5).map((track: any, index: number) => (
              <Link
                key={track.id}
                href={`/dashboard/track/${track.id}`}
                className="group flex items-center gap-4 p-4 hover:bg-neutral-800/80 transition-all duration-300 border-b border-neutral-800/50 last:border-0"
              >
                <span className="w-6 text-center text-neutral-500 font-bold group-hover:text-green-500">
                  {index + 1}
                </span>
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={track.album.images[0]?.url || "/placeholder-album.png"}
                    alt={track.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate group-hover:text-green-500 transition-colors">
                    {track.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {track.album.name}
                  </p>
                </div>
                <div className="px-4 text-sm text-neutral-500 tabular-nums">
                  {formatDuration(track.duration_ms)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Discografía</h2>
          <div className="grid grid-cols-2 gap-4">
            {albums.items.slice(0, 4).map((album: any) => (
              <div key={album.id} className="group space-y-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group-hover:shadow-green-500/10 transition-all duration-300">
                  <Image
                    src={album.images[0]?.url || "/placeholder-album.png"}
                    alt={album.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="px-1">
                  <p className="font-bold text-sm truncate group-hover:text-green-500 transition-colors">
                    {album.name}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase tracking-tighter">
                    {album.release_date.split("-")[0]} • {album.album_type === "single" ? "Sencillo" : "Álbum"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
