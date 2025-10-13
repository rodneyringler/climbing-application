'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Workout } from './workout';

// Zod schemas for form validation
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

// Server action functions for form handling
export async function createWorkout(formData: FormData) {
  const { program, name, started, ended } = CreateWorkout.parse({
    program: formData.get('program'),
    name: formData.get('name'),
    started: formData.get('started') || null,
    ended: formData.get('ended') || null,
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  await Workout.create(session.user.id, program, name, started, ended);

  revalidatePath('/ui/dashboard/workouts');
  redirect('/ui/dashboard/workouts');
}

export async function updateWorkout(id: string, formData: FormData) {
  const { user, program, name, started, ended } = UpdateWorkout.parse({
    user: formData.get('userId'), // Use userId instead of user
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
