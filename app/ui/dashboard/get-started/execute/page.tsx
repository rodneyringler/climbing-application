import postgres from 'postgres';
import { notFound } from 'next/navigation';
import WorkoutExecutor from '@/app/ui-components/get-started/workout-executor';

export interface ExecutorExercise {
  id: string;
  title: string;
  description: string;
  exerciseTypeName: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
}

export interface ExecutorProgram {
  id: string;
  name: string;
  exercises: ExecutorExercise[];
}

interface PageProps {
  searchParams: Promise<{ type?: string; id?: string }>;
}

export default async function ExecutePage({ searchParams }: PageProps) {
  const { type, id } = await searchParams;

  if (!type || !id) notFound();

  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  if (type === 'exercise') {
    const rows = await sql<ExecutorExercise[]>`
      SELECT
        e.id,
        e.title,
        e.description,
        COALESCE(et.name, '')  AS "exerciseTypeName",
        e.istimed              AS "isTimed",
        e.reps,
        e.sets,
        e.resttime             AS "restTime",
        e.worktime             AS "workTime"
      FROM exercises e
      LEFT JOIN exercisetypes et ON e.exercisetype = et.id
      WHERE e.id = ${id}
    `;
    if (!rows[0]) notFound();

    return <WorkoutExecutor mode="exercise" exercise={rows[0]} />;
  }

  if (type === 'program') {
    const rows = await sql<{ id: string; name: string }[]>`
      SELECT id, name FROM programs WHERE id = ${id}
    `;
    if (!rows[0]) notFound();

    const exercises = await sql<ExecutorExercise[]>`
      SELECT
        e.id,
        e.title,
        e.description,
        COALESCE(et.name, '')  AS "exerciseTypeName",
        e.istimed              AS "isTimed",
        e.reps,
        e.sets,
        e.resttime             AS "restTime",
        e.worktime             AS "workTime"
      FROM programexercises pe
      JOIN exercises e        ON pe.exercise = e.id
      LEFT JOIN exercisetypes et ON e.exercisetype = et.id
      WHERE pe.program = ${id}
    `;

    const program: ExecutorProgram = { id: rows[0].id, name: rows[0].name, exercises };
    return <WorkoutExecutor mode="program" program={program} />;
  }

  notFound();
}
