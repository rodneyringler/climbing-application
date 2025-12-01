'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { auth } from '@/auth';
import { validatePassword } from '@/app/lib/utils';
import type { User } from '@/app/lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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

export async function getUserById(id: string) {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE id=${id}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserCount(): Promise<number> {
  try {
    const data = await sql`SELECT COUNT(*) FROM users`;
    return Number(data[0].count);
  } catch (error) {
    console.error('Failed to fetch user count:', error);
    throw new Error('Failed to fetch user count.');
  }
}

export async function updateAccountInfo(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return 'You must be logged in to update your account.';
  }

  const UpdateAccountSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().min(1, 'Current password is required'),
  });

  const validatedFields = UpdateAccountSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    currentPassword: formData.get('currentPassword'),
  });

  if (!validatedFields.success) {
    return 'Invalid input. Please check your information.';
  }

  const { name, email, currentPassword } = validatedFields.data;

  try {
    // Get current user data
    const user = await getUserById(session.user.id);
    if (!user) {
      return 'User not found.';
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return 'Current password is incorrect.';
    }

    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const existingUser = await sql<User[]>`SELECT * FROM users WHERE email=${email} AND id != ${session.user.id}`;
      if (existingUser.length > 0) {
        return 'An account with this email already exists.';
      }
    }

    // Update user information
    await sql`
      UPDATE users 
      SET name = ${name}, email = ${email}
      WHERE id = ${session.user.id}
    `;

    return 'Account information updated successfully.';
  } catch (error) {
    console.error('Account update error:', error);
    return 'Failed to update account information. Please try again.';
  }
}

export async function changePassword(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return 'You must be logged in to change your password.';
  }

  const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  });

  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return 'Invalid input. Please check your information.';
  }

  const { currentPassword, newPassword, confirmPassword } = validatedFields.data;

  if (newPassword !== confirmPassword) {
    return 'New passwords do not match.';
  }

  // Validate new password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return passwordValidation.errors.join('. ');
  }

  try {
    // Get current user data
    const user = await getUserById(session.user.id);
    if (!user) {
      return 'User not found.';
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return 'Current password is incorrect.';
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}
      WHERE id = ${session.user.id}
    `;

    return 'Password updated successfully.';
  } catch (error) {
    console.error('Password change error:', error);
    return 'Failed to change password. Please try again.';
  }
}
