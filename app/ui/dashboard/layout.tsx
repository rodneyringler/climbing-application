import SideNav from '@/app/ui-components/dashboard/sidenav';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {/* Outer panel: relative + overflow-hidden keeps background anchored */}
      <div className="flex-grow relative overflow-hidden">
        {/* Background stays fixed within the panel while content scrolls */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/hero_img3.png"
            fill
            className="object-cover"
            alt=""
            priority={false}
          />
        </div>
        {/* Scrollable content sits on top of the background */}
        <div className="relative z-10 h-full overflow-y-auto p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
