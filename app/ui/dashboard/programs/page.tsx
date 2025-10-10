import Pagination from '@/app/ui-components/dashboard/pagination';
import Search from '@/app/ui-components/search';
import ProgramsTable from '@/app/ui-components/programs/table';
import { lusitana } from '@/app/ui-components/fonts';
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Exercises</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search exercises..." />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <ProgramsTable />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={currentPage} />
      </div>
    </div>
  );
}

