import EditProgramForm from '@/app/ui-components/programs/edit-form';
import Breadcrumbs from '@/app/ui-components/dashboard/breadcrumbs';
import { Program } from '@/app/lib/program/program';
import { Exercise } from '@/app/lib/exercise/exercise';
import { Category } from '@/app/lib/category/category';
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

  const [program, exercises, categories] = await Promise.all([
    Program.fetchByNameAndUser(programName, session.user.id),
    Exercise.fetchAll(''),
    Category.fetchCategories(),
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

  const categoriesForForm = categories.map(category => ({
    id: category.id,
    name: category.name,
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
      <EditProgramForm program={program} exercises={exercisesForForm} categories={categoriesForForm} />
    </main>
  );
}
