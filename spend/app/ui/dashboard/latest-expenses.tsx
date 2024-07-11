import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestExpenses } from '@/app/lib/data';

export default async function LatestExpenses() {

    const latestExpenses = await fetchLatestExpenses();

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Latest Expense Records
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: Uncomment this code in Chapter 9 */}

                <div className="bg-white px-6">
                    {latestExpenses.map((expense, i) => {
                        return (
                            <div
                                key={expense.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="min-w-0">
                                        <div>
                                            <p className="truncate text-sm font-semibold md:text-base">
                                                {expense.reason}
                                            </p>
                                            <p className="text-sm text-gray-500 sm:block">
                                                {expense.issued_to}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {expense.amount}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
            </div>
        </div>
    );
}
