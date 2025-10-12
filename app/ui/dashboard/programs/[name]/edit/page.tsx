import EditProgramForm from '@/app/ui-components/programs/edit-form';
import Breadcrumbs from '@/app/ui-components/dashboard/breadcrumbs';
import { Program } from '@/app/lib/program/program';
import { Exercise } from '@/app/lib/exercise/exercise';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  const encodedName = params.name;
  const programName = decodeURIComponent(encodedName);
  
  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const [program, exercises] = await Promise.all([
    Program.fetchByNameAndUser(programName, session.user.id),
    Exercise.fetchAll(''),
  ]);

  if (!program) {
    notFound();
  }

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
            label: 'Edit Program',
            href: `/ui/dashboard/programs/${encodedName}/edit`,
            active: true,
          },
        ]}
      />
      <EditProgramForm program={program} exercises={exercisesForForm} />
    </main>
  );
}
