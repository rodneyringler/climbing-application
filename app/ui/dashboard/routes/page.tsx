import { lusitana } from '@/app/ui-components/fonts';
import RouteMap from '@/app/ui-components/routes/RouteMap';

export default function RoutesPage() {
  return (
    <main className="flex flex-col md:h-[calc(100vh-8rem)]">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl flex-none`}>
        Nearby Routes
      </h1>
      <div className="flex-1 min-h-0">
        <RouteMap />
      </div>
    </main>
  );
}
