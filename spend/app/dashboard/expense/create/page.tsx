import Form from '@/app/ui/invoices/create-form-expense';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchReason } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create',
};

export default async function Page() {
    const customers = await fetchReason();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Expenses', href: '/dashboard/expense' },
                    {
                        label: 'Add Expense',
                        href: '/dashboard/expense/create',
                        active: true,
                    }
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}