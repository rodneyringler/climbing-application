import CreateProgramForm from '@/app/ui-components/programs/create-form';
import Breadcrumbs from '@/app/ui-components/dashboard/breadcrumbs';
import { Exercise } from '@/app/lib/exercise/exercise';

export default async function Page() {
  const exercises = await Exercise.fetchAll('');
  const exercisesForForm = exercises.map(exercise => ({
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    exerciseTypeName: exercise.exerciseTypeName,
  }));

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Programs', href: '/ui/dashboard/programs' },
          {
            label: 'Create Program',
            href: '/ui/dashboard/programs/create',
            active: true,
          },
        ]}
      />
      <CreateProgramForm exercises={exercisesForForm} />
    </main>
  );
}
