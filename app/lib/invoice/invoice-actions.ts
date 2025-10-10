'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InvoiceClass } from '@/app/lib/invoice/invoice';

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
