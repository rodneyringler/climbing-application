
import { lusitana } from '@/app/ui-components/fonts';
import { Suspense } from 'react';
import DashboardSkeleton from '@/app/ui-components/skeletons';
import DashboardHeader from '@/app/ui-components/dashboard/header';
import CategoryWrapper, { Category } from '@/app/ui-components/dashboard/category';

export default async function Page() {
  return (
    <main>
      
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        <div>
          <DashboardHeader/>
        </div>
      </h1>
    </main>
  );
}
