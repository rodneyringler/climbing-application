import Pagination from '@/app/ui-components/dashboard/pagination';
import Search from '@/app/ui-components/search';
import Table from '@/app/ui-components/workouts/table';
import { CreateWorkout } from '@/app/ui-components/workouts/buttons';
import { lusitana } from '@/app/ui-components/fonts';
import { Workout } from '@/app/lib/workout/workout';
import { auth } from '@/auth';
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  
  // Get current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  
  const totalPages = await Workout.fetchPages(query, session.user.id);
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Workouts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search workouts..." />
        <CreateWorkout />
      </div>
        <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
