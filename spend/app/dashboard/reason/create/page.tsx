import { FormReason } from '@/app/ui/expenses/create-form-expense';
import Breadcrumbs from '@/app/ui/expenses/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create',
};

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Reason', href: '/dashboard/reason' },
                    {
                        label: 'Create Reason',
                        href: '/dashboard/reason/create',
                        active: true,
                    }
                ]}
            />
            <FormReason />
        </main>
    );
}