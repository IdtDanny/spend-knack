import { UpdateExpense, DeleteExpense, UpdateReason, DeleteReason } from '@/app/ui/expenses/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredExpenses, fetchFilteredReason } from '@/app/lib/data';

export async function ExpensesTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const expenses = await fetchFilteredExpenses(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {expenses?.map((expense) => (

                            <div key={expense.id} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between pb-2">
                                    <div>
                                        <p className="text-xl font-medium uppercase">{expense.reason}</p>
                                        <p className="text-sm text-gray-500">{expense.issued_to}</p>
                                    </div>
                                    <div>
                                        <p className='text-l font-medium'>{formatCurrency(expense.amount)}</p>
                                        <p className="text-sm text-gray-500">{formatDateToLocal(expense.date)}</p>
                                    </div>
                                </div>
                                <div className="flex w-full justify-end border-b pt-2 pb-4">
                                    <div className="flex gap-2">
                                        <UpdateExpense id={expense.id} />
                                        <DeleteExpense id={expense.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Reason
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Issued_To
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Amount
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Date
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {expenses?.map((expense) => (
                                <tr
                                    key={expense.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{expense.reason}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {expense.issued_to}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(expense.date)}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateExpense id={expense.id} />
                                            <DeleteExpense id={expense.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export async function ReasonTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const reasons = await fetchFilteredReason(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {reasons?.map((reason) => (

                            <div key={reason.id} className="mb-2 w-full rounded-md bg-white pb-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="text-l font-medium uppercase">{reason.reason}</p>
                                        <p className="text-sm text-gray-500">{formatDateToLocal(reason.date)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <UpdateReason id={reason.id} />
                                        <DeleteReason id={reason.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Reason
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Date
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {reasons?.map((reason) => (
                                <tr
                                    key={reason.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {reason.reason}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(reason.date)}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateReason id={reason.id} />
                                            <DeleteReason id={reason.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
