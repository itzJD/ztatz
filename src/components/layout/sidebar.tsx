"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  Music, 
  History, 
  Heart, 
  LogOut,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Top Artistas", href: "/dashboard/artists", icon: Users },
  { label: "Top Canciones", href: "/dashboard/tracks", icon: Music },
  { label: "Recientes", href: "/dashboard/recent", icon: History },
  { label: "Me Gusta", href: "/dashboard/liked", icon: Heart },
  { label: "No abrir", href: "/dashboard/no-abrir", icon: X },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header - Fixed at top, high z-index */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between px-6 z-[100]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-500" />
          <span className="font-bold text-white">Spotify Stats</span>
        </div>
        <button 
          onClick={toggleMenu} 
          className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile - Lower z-index than sidebar but higher than content */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" 
          onClick={closeMenu}
        />
      )}

      {/* Sidebar - Highest z-index when open on mobile */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-black border-r border-neutral-800 flex flex-col p-6 z-[120] transition-transform duration-300 ease-in-out lg:translate-x-0 w-72",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
          <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
            <BarChart3 className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Spotify Stats</h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 mt-16 lg:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive 
                    ? "bg-neutral-800 text-white font-semibold shadow-inner" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-green-500" : "group-hover:text-green-500"
                )} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Sign Out */}
        <div className="mt-auto pt-6 border-t border-neutral-900">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 px-4 py-3.5 w-full text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-2xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span className="text-[15px]">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
