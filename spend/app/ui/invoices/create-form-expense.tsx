'use client';

import { ReasonField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  CircleStackIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createExpense, State } from '@/app/lib/actions-expense';
import { useActionState } from 'react';

export default function Form({ customers }: { customers: ReasonField[] }) {
  const initialState: State = { message: null, errors: {} };

  const [state, formAction] = useActionState(createExpense, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Reason for Expense */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose reason
          </label>
          <div className="relative">
            <select
              id="customer"
              name="reason"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a reason
              </option>
              {customers.map((reason) => (
                <option key={reason.id} value={reason.reason}>
                  {reason.reason}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id='customer-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.reason &&
              state.errors.reason.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Expense Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter RWF amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id='amount-error' aria-live='polite' aria-atomic='true'>
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Expense Issued_to */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Enter Issuee
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="issuee"
                name="issued_to"
                type="text"
                placeholder="Enter an Issuee"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby='amount-error'
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id='amount-error' aria-live='polite' aria-atomic='true'>
              {state.errors?.issued_to &&
                state.errors.issued_to.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/expense"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Expense</Button>
      </div>
    </form>
  );
}
