'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { InvoiceClass } from './Invoice';
import { Exercise } from './Exercise';
import { ExerciseType } from './ExerciseType';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const ExerciseFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  creator: z.string().min(1, 'Creator is required'),
  exerciseType: z.string().min(1, 'Exercise type is required'),
  isTimed: z.boolean(),
  reps: z.coerce.number().min(0, 'Reps must be non-negative'),
  sets: z.coerce.number().min(0, 'Sets must be non-negative'),
  restTime: z.coerce.number().min(0, 'Rest time must be non-negative'),
  workTime: z.coerce.number().min(0, 'Work time must be non-negative'),
  isPublic: z.boolean(),
  description: z.string().min(1, 'Description is required'),
});

const CreateExercise = ExerciseFormSchema.omit({ id: true, creator: true });
const UpdateExercise = ExerciseFormSchema.omit({ id: true });

const ExerciseTypeFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

const CreateExerciseType = ExerciseTypeFormSchema.omit({ id: true });
const UpdateExerciseType = ExerciseTypeFormSchema.omit({ id: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    console.log(customerId, amount, status);

    await InvoiceClass.create(customerId, amount, status);

    revalidatePath('/ui/dashboard/invoices');
    redirect('/ui/dashboard/invoices');
}


export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  try {
    await InvoiceClass.update(id, customerId, amount, status);
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
  }
 
  revalidatePath('/ui/dashboard/invoices');
  redirect('/ui/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await InvoiceClass.delete(id);
    revalidatePath('/ui/dashboard/invoices');
  }

// Exercise Actions
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
  const { title, creator, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description } = UpdateExercise.parse({
    title: formData.get('title'),
    creator: formData.get('creator'),
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
    await Exercise.update(id, title, creator, exerciseType, isTimed, reps, sets, restTime, workTime, isPublic, description);
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

// ExerciseType Actions
export async function createExerciseType(formData: FormData) {
  const { name, description } = CreateExerciseType.parse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  await ExerciseType.create(name, description);

  revalidatePath('/ui/dashboard/exercises');
  redirect('/ui/dashboard/exercises');
}

export async function updateExerciseType(id: string, formData: FormData) {
  const { name, description } = UpdateExerciseType.parse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  try {
    await ExerciseType.update(id, name, description);
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/ui/dashboard/exercises');
  redirect('/ui/dashboard/exercises');
}

export async function deleteExerciseType(id: string) {
  await ExerciseType.delete(id);
  revalidatePath('/ui/dashboard/exercises');
}

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

  export async function createAccount(
    prevState: string | undefined,
    formData: FormData,
  ) {
    const CreateAccountSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(6, 'Password confirmation is required'),
    });

    const validatedFields = CreateAccountSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      return 'Invalid input. Please check your information.';
    }

    const { name, email, password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = randomUUID();

      await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${id}, ${name}, ${email}, ${hashedPassword})
      `;

      // Automatically sign in the user after account creation
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/ui/dashboard',
      });
    } catch (error) {
      console.error('Account creation error:', error);
      
      // Handle specific database errors
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return 'An account with this email already exists.';
      }
      
      return 'Failed to create account. Please try again.';
    }
  }