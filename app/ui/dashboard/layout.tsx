import SideNav from '@/app/ui-components/dashboard/sidenav';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 relative">
        {/* Subtle bouldering background */}
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/boldering-hero-desktop.png"
            fill
            className="object-cover"
            alt=""
            priority={false}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}