'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import WellHungLogo from '@/app/ui-components/well-hung-logo';
import { lusitana } from '@/app/ui-components/fonts';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function HeroSection() {
  const [showEmbed, setShowEmbed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (showEmbed || timerRef.current) return;
    timerRef.current = setTimeout(() => {
      setShowEmbed(true);
      window.instgrm?.Embeds.process();
    }, 2500);
  }

  function handleMouseLeave() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <>
      <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />

      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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

        {/* Instagram photo credit — fades in after 2.5s hover */}
        <div
          className={`absolute bottom-8 right-8 z-20 w-80 transition-all duration-500 ${
            showEmbed
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="relative">
            <button
              onClick={() => setShowEmbed(false)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-4 h-4 text-stone-700" />
            </button>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/josephhillphoto/?utm_source=ig_embed&utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '3px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: 0,
                maxWidth: '540px',
                minWidth: '280px',
                padding: 0,
                width: '100%',
              }}
            >
              <div style={{ padding: '16px' }}>
                <a
                  href="https://www.instagram.com/josephhillphoto/?utm_source=ig_embed&utm_campaign=loading"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#c9c8cd',
                    fontFamily: 'Arial,sans-serif',
                    fontSize: '14px',
                    lineHeight: '17px',
                    textDecoration: 'none',
                  }}
                >
                  Joe Hill (@josephhillphoto) • Instagram photos and videos
                </a>
              </div>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
}
