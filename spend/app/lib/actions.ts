'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { error } from 'console';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const AddUser = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    email: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    password: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    confirmPassword: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
}).omit({ id: true });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Using Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export type StateUser = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    // Prepare data for insertion into database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100; // Converting money to cents
    const date = new Date().toISOString().split('T')[0];
    // console.log(rawFormData);

    // Insert data into database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        // if a database error occurs, return a more specific error.
        return { message: 'Database Error: Failed to Create Invoice.' };
    }

    // Revalidate the cache for the invoices age and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
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

export async function addUser(prevState: StateUser, formData: FormData) {
    // Validate form fields using Zod

    console.log('Done');

    const validatedFields = AddUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('password'),
    });

    console.log(validatedFields.data?.password);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Add User.',
        }
    }

    const password1 = validatedFields.data?.password;
    const password2 = validatedFields.data?.confirmPassword;

    if (password1 == password2) {
        const hashedPassword = await bcrypt.hash(password1, 10);


        const { name, email, password } = validatedFields.data;
        const date = new Date().toISOString().split('T')[0];
        const image_url = '/customers/evil-rabbit.png';

        // Insert data into database
        try {
            await sql`
        INSERT INTO users (name, email, password, image_url, date)
        VALUES (${name}, ${email}, ${hashedPassword}, ${image_url}, ${date})
        `;
        } catch (error) {
            return { message: 'Database Error: Failed to Add User.' };
        }
    }

    revalidatePath('/');
    redirect('/');
}