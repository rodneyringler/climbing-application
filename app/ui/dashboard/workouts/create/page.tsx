import CreateWorkoutForm from '@/app/ui-components/workouts/create-form';
import Breadcrumbs from '@/app/ui-components/dashboard/breadcrumbs';
import { Program } from '@/app/lib/program/program';
import { auth } from '@/auth';
 
export default async function Page() {
  // Get current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  
  // Fetch programs for the current user
  const programs = await Program.fetchFiltered('', 1); // Get all programs for user
  const userPrograms = programs.map(p => ({ name: p.name, description: p.description }));
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Workouts', href: '/ui/dashboard/workouts' },
          {
            label: 'Create Workout',
            href: '/ui/dashboard/workouts/create',
            active: true,
          },
        ]}
      />
      <CreateWorkoutForm programs={userPrograms} />
    </main>
  );
}
