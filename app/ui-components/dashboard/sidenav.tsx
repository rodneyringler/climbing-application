'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, PowerIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui-components/fonts';
import NavLinks from '@/app/ui-components/dashboard/nav-links';
import { signOutAction } from '@/app/lib/account/sign-out-action';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Hamburger toggle — always fixed top-left, above everything */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        className="fixed top-4 left-4 z-[10002] flex items-center justify-center w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:bg-sage-50 transition-colors"
      >
        {isOpen
          ? <XMarkIcon className="w-5 h-5 text-stone-700" />
          : <Bars3Icon className="w-5 h-5 text-stone-700" />
        }
      </button>

      {/* Mobile backdrop — closes drawer on tap outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        Drawer:
        - Closed:   translateX(-100%) — fully off-screen
        - Open mobile:   translateX(0), full width
        - Open desktop:  translateX(0), w-16 (icon strip); hover expands to w-64
        - group class lets child elements use group-hover: for text reveal
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[10001] flex flex-col
          bg-white shadow-xl overflow-hidden
          transition-transform duration-250 ease-in-out
          w-full md:w-16 md:hover:w-64 md:transition-all md:duration-200
          group
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo — top of drawer, padded to clear hamburger button */}
        <div className="flex items-center gap-3 px-3 pt-16 pb-4 border-b border-stone-100 flex-none">
          <div className="w-10 h-10 flex-none flex items-center justify-center rounded-lg bg-sage-500 overflow-hidden">
            <img src="/favicon.ico" alt="logo" width={40} height={40} className="object-cover" />
          </div>
          <span className={`${lusitana.className} text-stone-800 text-base font-semibold whitespace-nowrap leading-tight opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150`}>
            ClimbTrackr
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          <NavLinks onNavigate={() => setIsOpen(false)} />
        </nav>

        {/* Sign out */}
        <div className="border-t border-stone-100 p-2 flex-none">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <PowerIcon className="w-5 h-5 flex-none" />
              <span className="text-sm font-medium whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
                Sign Out
              </span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
