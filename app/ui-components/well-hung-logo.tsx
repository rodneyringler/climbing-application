import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui-components/fonts';
import Image from 'next/image';

export default function WellHungLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image src="/favicon.ico" alt="logo" width={68} height={48}/>
      <p className="text-[44px]">Climb<br />Trackr</p>
    </div>
  );
}
