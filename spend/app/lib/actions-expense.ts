'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { error } from 'console';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    reason: z.string({
        invalid_type_error: 'Please select reason for expense.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than RWF 0.' }),
    issued_to: z.string({
        invalid_type_error: 'Please select reason for expense.',
    }),
    date: z.string(),
});

const CreateExpense = FormSchema.omit({ id: true, date: true });


export type State = {
    errors?: {
        reason?: string[];
        amount?: string[];
        issued_to?: string[];
    };
    message?: string | null;
};

export async function createExpense(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateExpense.safeParse({
        reason: formData.get('reason'),
        amount: formData.get('amount'),
        issued_to: formData.get('issued_to'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Add Expense.',
        }
    }

    // Prepare data for insertion into database
    const { reason, amount, issued_to } = validatedFields.data;
    // const amountInCents = amount * 100; // Converting money to cents
    const date = new Date().toISOString().split('T')[0];
    // console.log(rawFormData);

    // Insert data into database
    try {
        await sql`
        INSERT INTO expenses (reason, amount, issued_to, date)
        VALUES (${reason}, ${amount}, ${issued_to}, ${date})
        `;
    } catch (error) {
        // if a database error occurs, return a more specific error.
        return { message: 'Database Error: Failed to Add Expense.' };
    }

    // Revalidate the cache for the invoices age and redirect the user.
    revalidatePath('/dashboard/expense');
    redirect('/dashboard/expense');
}