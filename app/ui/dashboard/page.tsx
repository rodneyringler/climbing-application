import RouteMap from '@/app/ui-components/routes/RouteMap';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/solid';

export default function DashboardPage() {
  return (
    /*
     * Break out of the layout's mobile and desktop padding so the map fills
     * edge-to-edge. 100svh + overflow-hidden ensures the map gets a
     * concrete, mobile-safe height to render into (RouteMap uses h-full internally).
     * Keep this wrapper in sync with the responsive RouteMap layout.
     */
    <div className="-mx-4 -mb-4 -mt-16 sm:-mx-6 sm:-mb-6 sm:-mt-16 md:-m-12 h-[100svh] overflow-hidden relative">
      <RouteMap />

      {/*
       * "Get Started" FAB — z-[5000] keeps it above the map but below
       * the sidenav drawer (z-[10001]) and hamburger (z-[10002]).
       */}
      <Link
        href="/ui/dashboard/get-started"
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[5000] flex max-w-[calc(100vw-6rem)] items-center justify-center gap-2 rounded-full border border-stone-200/70 bg-white/95 px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white hover:shadow-lg sm:top-0 sm:w-36 sm:rounded-b-2xl sm:rounded-t-none sm:border-x-0 sm:border-t-0 sm:px-0 sm:py-3 sm:hover:w-screen sm:hover:rounded-none"
      >
        <PlayIcon className="w-3.5 h-3.5 text-sage-500" />
        Get Started
      </Link>
    </div>
  );
}
