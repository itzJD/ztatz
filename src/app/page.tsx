import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Music } from "lucide-react";

export default async function Home() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error checking auth session:", error);
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-900 to-black">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-center">
          <div className="bg-green-500 p-4 rounded-full shadow-2xl shadow-green-500/20">
            <Music className="w-16 h-16 text-black" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
          Tus Stats de Spotify
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Descubre tus artistas favoritos, canciones más escuchadas y analiza tus hábitos musicales con un solo clic.
        </p>

        <div className="flex justify-center pt-8">
          <form
            action={async () => {
              "use server";
              await signIn("spotify", { redirectTo: "/dashboard" });
            }}
          >
            <button className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-10 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-3 text-lg">
              Conectar con Spotify
            </button>
          </form>
        </div>
        
        <p className="text-sm text-neutral-500 pt-12">
          Hecho con Next.js, Tailwind y Auth.js
        </p>
      </div>
    </main>
  );
}
