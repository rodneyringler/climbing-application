import AcmeLogo from '@/app/ui-components/well-hung-logo';
import LoginForm from '@/app/ui-components/login-form';
import { Suspense } from 'react';
import Image from 'next/image';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen relative">
      {/* Subtle bouldering background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/boldering-hero-desktop.png"
          fill
          className="object-cover"
          alt=""
          priority={false}
        />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-sage-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}