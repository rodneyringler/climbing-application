import CreateExerciseForm from '@/app/ui-components/exercises/create-form';
import Breadcrumbs from '@/app/ui-components/invoices/breadcrumbs';
import { ExerciseType } from '@/app/lib/exercise/exerciseType';
 
export default async function Page() {
  const exerciseTypes = await ExerciseType.fetchExerciseTypes();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Exercises', href: '/ui/dashboard/exercises' },
          {
            label: 'Create Exercise',
            href: '/ui/dashboard/exercises/create',
            active: true,
          },
        ]}
      />
      <CreateExerciseForm exerciseTypes={exerciseTypes} />
    </main>
  );
}