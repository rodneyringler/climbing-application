import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteExercise } from '@/app/lib/exercise/exercise-actions';

export function CreateExercise() {
  return (
    <Link
      href="/ui/dashboard/exercises/create"
      className="flex h-10 items-center rounded-lg bg-sage-500 px-4 text-sm font-medium text-white transition-colors hover:bg-sage-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500"
    >
      <span className="hidden md:block">Create Exercise</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateExercise({ id }: { id: string }) {
  return (
    <Link
    href={`/ui/dashboard/exercises/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteExercise({ id }: { id: string }) {
  const deleteExerciseWithId = deleteExercise.bind(null, id);
  return (
    <form action={deleteExerciseWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
