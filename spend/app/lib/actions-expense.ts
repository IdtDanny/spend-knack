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
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    issued_to: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    date: z.string(),
});

const CreateExpense = FormSchema.omit({ id: true, date: true });

const CreateReason = z.object({
    id: z.string(),
    reason: z.string({
        invalid_type_error: 'Please select a reason.',
    }),
    date: z.string(),
}).omit({ id: true, date: true });

const UpdateReason = z.object({
    id: z.string(),
    reason: z.string({
        invalid_type_error: 'Please select a reason.',
    }),
    date: z.string(),
}).omit({ id: true, date: true });

// Using Zod to update the expected types
const UpdateExpense = FormSchema.omit({ id: true, date: true });

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

    console.log(validatedFields);

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
        return { message: 'Database Error: Failed to Create Invoice.' };
    }

    // Revalidate the cache for the invoices age and redirect the user.
    revalidatePath('/dashboard/expense');
    redirect('/dashboard/expense');
}

export async function updateExpense(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateExpense.safeParse({
        reason: formData.get('reason'),
        amount: formData.get('amount'),
        issued_to: formData.get('issued_to'),
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Expense.',
        };
    }

    const { reason, amount, issued_to } = validatedFields.data;
    // const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE expenses
        SET reason = ${reason}, amount = ${amount}, issued_to = ${issued_to}
        WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/expense');
    redirect('/dashboard/expense');
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

export async function deleteExpense(id: string) {

    try {
        await sql`DELETE FROM expenses WHERE id = ${id}`;
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Expense.' };
    }

    revalidatePath('/dashboard/expense');
}

export async function deleteReason(id: string) {

    try {
        await sql`DELETE FROM reason WHERE id = ${id}`;
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Reason.' };
    }

    revalidatePath('/dashboard/reason');
}

export async function createReason(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateReason.safeParse({
        reason: formData.get('reason')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create a reason.',
        }
    }

    // Prepare data for insertion into database
    const { reason } = validatedFields.data;
    // const amountInCents = amount * 100; // Converting money to cents
    const date = new Date().toISOString().split('T')[0];
    // console.log(rawFormData);

    // Insert data into database
    try {
        await sql`
        INSERT INTO reason (reason, date)
        VALUES (${reason}, ${date})
        `;
    } catch (error) {
        // if a database error occurs, return a more specific error.
        return { message: 'Database Error: Failed to Create Reason.' };
    }

    // Revalidate the cache for the invoices age and redirect the user.
    revalidatePath('/dashboard/reason');
    redirect('/dashboard/reason');
}

export async function updateReason(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateReason.safeParse({
        reason: formData.get('reason')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Reason.',
        };
    }

    const { reason } = validatedFields.data;
    // const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        UPDATE reason
        SET reason = ${reason} date = ${date}
        WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Reason.' };
    }

    revalidatePath('/dashboard/reason');
    redirect('/dashboard/reason');
}