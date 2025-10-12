'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Program } from './program';

// Zod schemas for form validation
const ProgramFormSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  description: z.string().min(1, 'Description is required'),
  exercises: z.array(z.string()).min(1, 'At least one exercise is required'),
});

const CreateProgram = ProgramFormSchema;
const UpdateProgram = ProgramFormSchema.extend({
  oldName: z.string().min(1, 'Old program name is required'),
});

// Server action functions for form handling
export async function createProgram(formData: FormData) {
  const { name, description, exercises } = CreateProgram.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    exercises: formData.getAll('exercises'),
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  await Program.create(name, description, session.user.id, exercises);

  revalidatePath('/ui/dashboard/programs');
  redirect('/ui/dashboard/programs');
}

export async function updateProgram(oldName: string, formData: FormData) {
  const { name, description, exercises } = UpdateProgram.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    exercises: formData.getAll('exercises'),
    oldName: oldName,
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    await Program.update(oldName, name, description, session.user.id, exercises);
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/ui/dashboard/programs');
  redirect('/ui/dashboard/programs');
}

export async function deleteProgram(name: string) {
  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  await Program.delete(name, session.user.id);
  revalidatePath('/ui/dashboard/programs');
}
