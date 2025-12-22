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
  categories: z.array(z.string()).min(1, 'At least one category is required'),  
  exercises: z.array(z.string()).min(1, 'At least one exercise is required'),
});

const CreateProgram = ProgramFormSchema;
const UpdateProgram = ProgramFormSchema.extend({
  oldName: z.string().min(1, 'Old program name is required'),
  categories: z.array(z.string()).optional(), // Make categories optional for updates
});

// Server action functions for form handling
export async function createProgram(formData: FormData) {
  const { name, description, categories, exercises } = CreateProgram.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    categories: formData.getAll('categories'),
    exercises: formData.getAll('exercises'),
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    await Program.create(name, description, session.user.id, categories, exercises);
  } catch (error: any) {
    if (error?.message?.includes('already exists')) {
      throw error;
    }
    throw error;
  }

  revalidatePath('/ui/dashboard/programs');
  redirect('/ui/dashboard/programs');
}

export async function updateProgram(oldName: string, formData: FormData) {
  const { name, description, categories, exercises } = UpdateProgram.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    categories: formData.getAll('categories').length > 0 ? formData.getAll('categories') : undefined,
    exercises: formData.getAll('exercises'),
    oldName: oldName,
  });

  // Get the current user session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    await Program.update(oldName, name, description, session.user.id, categories || [], exercises);
  } catch (error: any) {
    console.error(error);
    if (error?.message?.includes('already exists')) {
      throw error;
    }
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
