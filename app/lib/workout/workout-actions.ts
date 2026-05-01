'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Workout } from './workout';
import postgres from 'postgres';

const WorkoutFormSchema = z.object({
  id: z.string(),
  user: z.string().min(1, 'User is required'),
  program: z.string().min(1, 'Program is required'),
  name: z.string().min(1, 'Name is required'),
  started: z.string().nullable(),
  ended: z.string().nullable(),
});

const CreateWorkout = WorkoutFormSchema.omit({ id: true, user: true });
const UpdateWorkout = WorkoutFormSchema.omit({ id: true });

// Shared core — no FormData parsing, no redirect. Both public actions call this.
async function persistWorkout(
  userId: string,
  programId: string,
  name: string,
  startedAt: string | null,
  endedAt: string | null,
) {
  await Workout.create(userId, programId, name, startedAt, endedAt);
  revalidatePath('/ui/dashboard/workouts');
}

// Form action — used by the create workout form. Parses FormData and redirects.
export async function createWorkout(formData: FormData) {
  const { program, name, started, ended } = CreateWorkout.parse({
    program: formData.get('program'),
    name: formData.get('name'),
    started: formData.get('started') || null,
    ended: formData.get('ended') || null,
  });

  const session = await auth();
  if (!session?.user?.id) throw new Error('User not authenticated');

  await persistWorkout(session.user.id, program, name, started, ended);
  redirect('/ui/dashboard/workouts');
}

// Programmatic action — called from WorkoutExecutor after program completion.
// Returns a result instead of redirecting so the client can handle UI state.
export async function saveExecutionWorkout(
  programId: string,
  programName: string,
  startedAt: string,
  endedAt: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Not authenticated' };
    await persistWorkout(session.user.id, programId, programName, startedAt, endedAt);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save workout' };
  }
}

export async function updateWorkout(id: string, formData: FormData) {
  const { user, program, name, started, ended } = UpdateWorkout.parse({
    user: formData.get('userId'),
    program: formData.get('program'),
    name: formData.get('name'),
    started: formData.get('started') || null,
    ended: formData.get('ended') || null,
  });

  try {
    await Workout.update(id, user, program, name, started, ended);
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/ui/dashboard/workouts');
  redirect('/ui/dashboard/workouts');
}

export async function deleteWorkout(id: string) {
  await Workout.delete(id);
  revalidatePath('/ui/dashboard/workouts');
}

export async function getWorkoutCount(): Promise<number> {
  try {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    const data = await sql`SELECT COUNT(*) FROM workouts`;
    return Number(data[0].count);
  } catch (error) {
    console.error('Failed to fetch workout count:', error);
    throw new Error('Failed to fetch workout count.');
  }
}
