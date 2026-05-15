import type { Metadata } from 'next';
import { landingPageBySlug } from '@/app/lib/marketing/landing-pages';
import MarketingLandingPage from '@/app/ui-components/marketing/marketing-landing-page';

const page = landingPageBySlug['climbing-endurance-workouts'];

export const metadata: Metadata = {
  title: `${page.title} | ClimbTrackr`,
  description: page.metaDescription,
};

export default function Page() {
  return <MarketingLandingPage page={page} />;
}
