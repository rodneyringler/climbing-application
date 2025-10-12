'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Exercise } from './exercise';

// Zod schemas for form validation
const ExerciseFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  user: z.string().min(1, 'User is required'),
  exerciseType: z.string().min(1, 'Exercise type is required'),
  isTimed: z.boolean(),
  reps: z.coerce.number().min(0, 'Reps must be non-negative'),
  sets: z.coerce.number().min(0, 'Sets must be non-negative'),
  restTime: z.coerce.number().min(0, 'Rest time must be non-negative'),
  workTime: z.coerce.number().min(0, 'Work time must be non-negative'),
  isPublic: z.boolean(),
  description: z.string().min(1, 'Description is required'),
});

const CreateExercise = ExerciseFormSchema.omit({ id: true, user: true });
const UpdateExercise = ExerciseFormSchema.omit({ id: true });

// Server action functions for form handling
export async function createExercise(formData: FormData) {
  const { title, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description } = CreateExercise.parse({
    title: formData.get('title'),
    exerciseType: formData.get('exerciseType'),
    isTimed: formData.get('isTimed') === 'on',
    reps: formData.get('reps'),
    sets: formData.get('sets'),
    restTime: formData.get('restTime'),
    workTime: formData.get('workTime'),
    isPublic: formData.get('isPublic') === 'on',
    description: formData.get('description'),
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  await Exercise.create(title, session.user.id, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description);

  revalidatePath('/ui/dashboard/exercises');
  redirect('/ui/dashboard/exercises');
}

export async function updateExercise(id: string, formData: FormData) {
  const { title, user, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description } = UpdateExercise.parse({
    title: formData.get('title'),
    user: formData.get('userId'), // Use userId instead of user
    exerciseType: formData.get('exerciseType'),
    isTimed: formData.get('isTimed') === 'on',
    reps: formData.get('reps'),
    sets: formData.get('sets'),
    restTime: formData.get('restTime'),
    workTime: formData.get('workTime'),
    isPublic: formData.get('isPublic') === 'on',
    description: formData.get('description'),
  });

  try {
    await Exercise.update(id, title, user, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description);
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/ui/dashboard/exercises');
  redirect('/ui/dashboard/exercises');
}

export async function deleteExercise(id: string) {
  await Exercise.delete(id);
  revalidatePath('/ui/dashboard/exercises');
}
