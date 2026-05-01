import postgres from 'postgres';
import { auth } from '@/auth';
import SelectionMenu from '@/app/ui-components/get-started/selection-menu';
import { lusitana } from '@/app/ui-components/fonts';

export interface SelectableExercise {
  id: string;
  title: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
  description: string;
  exerciseTypeId: string;
  exerciseTypeName: string;
}

export interface SelectableProgram {
  id: string;
  name: string;
  description: string;
  exerciseCount: number;
  categoryIds: string[];
  categoryNames: string[];
}

export interface SelectableCategory {
  id: string;
  name: string;
}

export interface SelectableExerciseType {
  id: string;
  name: string;
}

export default async function GetStartedPage() {
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  const [exercises, programs, exerciseTypes, categories] = await Promise.all([
    // All exercises visible to this user (own + public)
    sql<SelectableExercise[]>`
      SELECT
        e.id,
        e.title,
        e.istimed        AS "isTimed",
        e.reps,
        e.sets,
        e.resttime       AS "restTime",
        e.worktime       AS "workTime",
        e.description,
        et.id            AS "exerciseTypeId",
        et.name          AS "exerciseTypeName"
      FROM exercises e
      LEFT JOIN exercisetypes et ON e.exercisetype = et.id
      WHERE e."user" = ${userId} OR e.ispublic = true
      ORDER BY e.title ASC
    `,

    // Programs belonging to this user, with aggregated category info
    sql<SelectableProgram[]>`
      SELECT
        p.id,
        p.name,
        p.description,
        COUNT(pe.exercise)::int                                          AS "exerciseCount",
        COALESCE(ARRAY_AGG(DISTINCT c.id)   FILTER (WHERE c.id   IS NOT NULL), ARRAY[]::uuid[]) AS "categoryIds",
        COALESCE(ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), ARRAY[]::text[]) AS "categoryNames"
      FROM programs p
      LEFT JOIN programexercises pe ON p.id = pe.program
      LEFT JOIN programcategory  pc ON p.id = pc.program
      LEFT JOIN categories       c  ON pc.category = c.id
      WHERE p."user" = ${userId}
      GROUP BY p.id, p.name, p.description
      ORDER BY p.name ASC
    `,

    sql<SelectableExerciseType[]>`SELECT id, name FROM exercisetypes ORDER BY name ASC`,
    sql<SelectableCategory[]>`SELECT id, name FROM categories ORDER BY name ASC`,
  ]);

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className={`${lusitana.className} mb-6 text-2xl md:text-3xl text-stone-800`}>
        Get Started
      </h1>
      <SelectionMenu
        exercises={exercises}
        programs={programs}
        exerciseTypes={exerciseTypes}
        categories={categories}
      />
    </main>
  );
}
