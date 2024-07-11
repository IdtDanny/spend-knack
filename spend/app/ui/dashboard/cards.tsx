import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
};
import { fetchCardData, fetchCardDataTemp } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';

export default async function CardWrapper() {

    const {
        totalPaidInvoices,
        totalPendingInvoices,
        numberOfInvoices,
        numberOfCustomers
    } = await fetchCardData();

    const {
        totalExpensesAmount,
        numberOfExpenses,
        numberOfReasons,
    } = await fetchCardDataTemp();

    return (
        <>
            {/* NOTE: Uncomment this code in Chapter 9 */}

            {/* <Card title="Collected" value={totalExpensesAmount} type="collected" /> */}
            <Card title="Total Expenses" value={totalExpensesAmount} type="pending" />
            <Card title="Total Reasons" value={numberOfReasons} type="invoices" />
            <Card title="Number of Expenses" value={numberOfExpenses} type="customers" />
        </>
    );
}

export function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
    const Icon = iconMap[type];

    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p
                className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                {value}
            </p>
        </div>
    );
}
