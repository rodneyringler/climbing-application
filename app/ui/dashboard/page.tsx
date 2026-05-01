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
        className="fixed bottom-8 right-8 z-[5000] flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-colors"
      >
        <PlayIcon className="w-4 h-4" />
        Get Started
      </Link>
    </div>
  );
}
