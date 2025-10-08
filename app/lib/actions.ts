'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
 
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

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    console.log(customerId, amount, status);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/ui/dashboard/invoices');
    redirect('/ui/dashboard/invoices');
}


export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
  }
 
  revalidatePath('/ui/dashboard/invoices');
  redirect('/ui/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/ui/dashboard/invoices');
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