import SideNav from '@/app/ui-components/dashboard/sidenav';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden relative">
      {/* Overlay sidenav — fixed positioned, does not affect document flow */}
      <SideNav />

      {/* Full-width content area */}
      <div className="h-full relative overflow-hidden">
        {/* Background image behind all dashboard pages */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/hero_img3.png"
            fill
            className="object-cover"
            alt=""
            priority={false}
          />
        </div>
        {/* Scrollable content sits on top */}
        <div className="relative z-10 h-full overflow-y-auto p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
