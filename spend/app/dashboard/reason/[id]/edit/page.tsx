import { EditReasonForm } from '@/app/ui/invoices/edit-form-expense';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchReasonsById, fetchReason } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit',
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [expense, reason] = await Promise.all([
        fetchReasonsById(id),
        fetchReason(),
    ]);

    if (!expense) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Expenses', href: '/dashboard/reason' },
                    {
                        label: 'Edit Reason',
                        href: '/dashboard/reason/${id}/edit',
                        active: true,
                    },
                ]}
            />
            <EditReasonForm expense={expense} reasons={reason} />
        </main>
    );
}