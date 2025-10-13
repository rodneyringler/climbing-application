import EditWorkoutForm from '@/app/ui-components/workouts/edit-form';
import Breadcrumbs from '@/app/ui-components/dashboard/breadcrumbs';
import { Workout } from '@/app/lib/workout/workout';
import { Program } from '@/app/lib/program/program';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const [workout, programs] = await Promise.all([
        Workout.fetchById(id),
        Program.fetchFiltered('', 1), // Get all programs for user
      ]);

    if (!workout) {
    notFound();
    }
    
    const userPrograms = programs.map(p => ({ name: p.name, description: p.description }));
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Workouts', href: '/ui/dashboard/workouts' },
          {
            label: 'Edit Workout',
            href: `/ui/dashboard/workouts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditWorkoutForm workout={workout} programs={userPrograms} />
    </main>
  );
}
