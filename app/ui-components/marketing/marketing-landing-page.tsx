import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui-components/fonts';
import type { LandingPage } from '@/app/lib/marketing/landing-pages';

export default function MarketingLandingPage({ page }: { page: LandingPage }) {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      <section className="bg-gradient-to-br from-sage-600 via-sage-500 to-brown-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Link href="/" className="mb-10 inline-flex text-sm font-semibold text-stone-100 hover:text-white">
            ← Back to ClimbTrackr
          </Link>
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-stone-100">{page.eyebrow}</p>
            <h1 className={`${lusitana.className} mb-6 text-4xl font-bold md:text-6xl`}>{page.heroTitle}</h1>
            <p className="mb-8 text-xl leading-8 text-stone-100 md:text-2xl">{page.heroLead}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/ui/signup"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 text-lg font-semibold text-sage-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-stone-100"
              >
                Start building your plan
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/ui/login"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-7 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-sage-600"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_360px]">
          <article className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <p className="text-lg leading-8 text-stone-600">{page.description}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {page.outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-xl bg-stone-100 p-5">
                    <CheckCircleIcon className="mb-3 h-6 w-6 text-sage-600" />
                    <p className="font-medium text-stone-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {page.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className={`${lusitana.className} mb-4 text-3xl font-bold text-stone-800`}>{section.heading}</h2>
                <p className="mb-6 text-lg leading-8 text-stone-600">{section.body}</p>
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-stone-700">
                      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-sage-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className={`${lusitana.className} mb-6 text-3xl font-bold text-stone-800`}>Sample weekly structure</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {page.sampleWeek.map((item) => (
                  <div key={`${item.day}-${item.focus}`} className="rounded-xl border border-stone-200 bg-stone-100 p-5">
                    <p className="text-sm font-bold uppercase tracking-wide text-sage-600">{item.day}</p>
                    <h3 className="mt-2 text-lg font-bold text-stone-800">{item.focus}</h3>
                    <p className="mt-2 text-stone-600">{item.details}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className={`${lusitana.className} mb-6 text-3xl font-bold text-stone-800`}>Common questions</h2>
              <div className="space-y-6">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-xl font-bold text-stone-800">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-stone-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="sticky top-6 rounded-2xl bg-white p-8 shadow-lg">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-600">Best for</p>
              <p className="mt-3 text-lg font-semibold text-stone-800">{page.audience}</p>
              <div className="my-6 h-px bg-stone-200" />
              <h2 className={`${lusitana.className} text-2xl font-bold text-stone-800`}>Track it in ClimbTrackr</h2>
              <p className="mt-3 text-stone-600">
                Save exercises, organize programs, log workouts, and keep your climbing training history in one focused place.
              </p>
              <Link
                href="/ui/signup"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sage-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-sage-600"
              >
                Get started free
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
