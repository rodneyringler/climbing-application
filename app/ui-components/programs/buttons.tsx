import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteProgram } from '@/app/lib/program/program-actions';

export function CreateProgram() {
  return (
    <Link
      href="/ui/dashboard/programs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Program</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProgram({ name }: { name: string }) {
  const encodedName = encodeURIComponent(name);
  return (
    <Link
      href={`/ui/dashboard/programs/${encodedName}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProgram({ name }: { name: string }) {
  const deleteProgramWithName = deleteProgram.bind(null, name);
  return (
    <form action={deleteProgramWithName}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
