import WellHungLogo from '@/app/ui-components/well-hung-logo';
import SignupForm from '@/app/ui-components/signup-form';
import { Suspense } from 'react';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen relative">
      {/* Subtle bouldering background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/hero_img5.png"
          fill
          className="object-cover"
          alt=""
          priority={false}
        />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-48 w-full items-end rounded-lg bg-sage-500 p-3 md:h-48">
          <div className="w-32 text-white md:w-36">
            <WellHungLogo />
          </div>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
