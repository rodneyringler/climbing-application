import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import WellHungLogo from '@/app/ui-components/well-hung-logo';
import { lusitana } from '@/app/ui-components/fonts';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_img.jpeg"
            fill
            className="object-cover"
            alt="Rock climbers"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <WellHungLogo />
          </div>
          <h1 className={`${lusitana.className} text-4xl md:text-6xl font-bold mb-6`}>
            Climb Higher, Track Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            The ultimate climbing companion for boulderers and mountaineers. Track your progress,
            build custom programs, and reach new heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ui/signup"
              className="flex items-center justify-center gap-3 bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Start Climbing</span>
              <ArrowRightIcon className="w-6 h-6" />
            </Link>
            <Link
              href="/ui/login"
              className="flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-stone-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              <span>Log In</span>
            </Link>
          </div>
        </div>

      </section>
  );
}
