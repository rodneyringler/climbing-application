import { UpdateWorkout, DeleteWorkout } from '@/app/ui-components/workouts/buttons';
import { Workout } from '@/app/lib/workout/workout';
import { auth } from '@/auth';

export default async function WorkoutsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Get current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  
  const workouts = await Workout.fetchFiltered(query, currentPage, session.user.id);

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  const calculateDuration = (started: string | null, ended: string | null) => {
    if (!started || !ended) return 'N/A';
    
    const start = new Date(started);
    const end = new Date(ended);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-stone-100 p-2 md:pt-0">
          <div className="md:hidden">
            {workouts?.map((workout) => (
              <div
                key={workout.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">{workout.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">Program: {workout.programName || workout.program}</p>
                    <p className="text-sm text-gray-500">Duration: {calculateDuration(workout.started, workout.ended)}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm">
                      Started: {formatDateTime(workout.started)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ended: {formatDateTime(workout.ended)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateWorkout id={workout.id} />
                    <DeleteWorkout id={workout.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Program
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Started
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ended
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {workouts?.map((workout) => (
                <tr
                  key={workout.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{workout.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {workout.programName || workout.program}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateTime(workout.started)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateTime(workout.ended)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {calculateDuration(workout.started, workout.ended)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateWorkout id={workout.id} />
                      <DeleteWorkout id={workout.id} />
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
