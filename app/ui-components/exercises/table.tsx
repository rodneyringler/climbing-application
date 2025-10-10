import { UpdateExercise, DeleteExercise } from '@/app/ui-components/exercises/buttons';
import { Exercise } from '@/app/lib/exercise/exercise';

export default async function ExercisesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const exercises = await Exercise.fetchFiltered(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {exercises?.map((exercise) => (
              <div
                key={exercise.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">{exercise.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                    <p className="text-sm text-gray-500">Creator: {exercise.creator}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                    <p className="text-sm text-gray-500">
                      {exercise.isTimed ? 'Timed' : 'Not timed'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateExercise id={exercise.id} />
                    <DeleteExercise id={exercise.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Creator
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sets × Reps
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Rest Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Work Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Timed
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Public
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {exercises?.map((exercise) => (
                <tr
                  key={exercise.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{exercise.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.creator}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.exerciseTypeName || exercise.exerciseType}
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-xs truncate" title={exercise.description}>
                      {exercise.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.sets} × {exercise.reps}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.restTime || 0}s
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.workTime || 0}s
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.isTimed ? 'Yes' : 'No'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {exercise.isPublic ? 'Yes' : 'No'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateExercise id={exercise.id} />
                      <DeleteExercise id={exercise.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
