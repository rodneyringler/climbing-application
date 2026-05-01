import RouteMap from '@/app/ui-components/routes/RouteMap';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/solid';

export default function DashboardPage() {
  return (
    /*
     * Break out of the layout's p-6 md:p-12 padding so the map fills
     * edge-to-edge. h-screen + overflow-hidden ensures the map gets a
     * concrete height to render into (RouteMap uses h-full internally).
     */
    <div className="-m-6 md:-m-12 h-screen overflow-hidden relative">
      <RouteMap />

      {/*
       * "Get Started" FAB — z-[5000] keeps it above the map but below
       * the sidenav drawer (z-[10001]) and hamburger (z-[10002]).
       */}
      <Link
        href="/ui/dashboard/get-started"
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[5000] flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm hover:bg-white text-stone-800 font-semibold text-sm w-36 hover:w-screen py-3 rounded-b-2xl hover:rounded-none shadow-md hover:shadow-lg border-b border-stone-200/60 transition-all duration-300 ease-in-out"
      >
        <PlayIcon className="w-3.5 h-3.5 text-sage-500" />
        Get Started
      </Link>
    </div>
  );
}
