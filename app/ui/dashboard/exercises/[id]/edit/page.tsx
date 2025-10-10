import EditExerciseForm from '@/app/ui-components/exercises/edit-form';
import Breadcrumbs from '@/app/ui-components/invoices/breadcrumbs';
import { Exercise } from '@/app/lib/exercise/exercise';
import { ExerciseType } from '@/app/lib/exercise/exerciseType';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [exercise, exerciseTypes] = await Promise.all([
        Exercise.fetchById(id),
        ExerciseType.fetchExerciseTypes(),
      ]);

    if (!exercise) {
    notFound();
    }
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Exercises', href: '/ui/dashboard/exercises' },
          {
            label: 'Edit Exercise',
            href: `/ui/dashboard/exercises/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditExerciseForm exercise={exercise} exerciseTypes={exerciseTypes} />
    </main>
  );
}