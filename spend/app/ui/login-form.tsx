'use client';

import { lusitana } from '@/app/ui/fonts';
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    UserIcon,
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button, Cancel } from './button';
import { useActionState } from 'react';
import { authenticate, addUser, StateUser } from '@/app/lib/actions';
import Link from 'next/link';
import { error } from 'console';

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Please log in to continue.
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                <div className='flex gap-3 justify-end'>
                    <Link href="/">
                        <Cancel className="mt-4 w-full">
                            Cancel <HandThumbDownIcon className="ml-2 h-5 w-5 text-gray-50" />
                        </Cancel>
                    </Link>
                    <Button className="mt-4 w-full" aria-disabled={isPending}>
                        Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                </div>
                <div className="flex h-8 items-end space-x-1" aria-live='polite' aria-atomic='true'>
                    {/* Add form errors here */}
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className='h5 w-5 text-red-500' />
                            <p className='text-sm text-red-500'>{errorMessage}</p>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

export function RegisterForm() {
    const initialState: StateUser = { message: null, errors: {} };

    const [state, formAction] = useActionState(addUser, initialState);

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Please Register to continue.
                </h1>
                <div className="w-full">
                    {/* Valid Full Names */}
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="username"
                        >
                            Your Names
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your Full names"
                                required
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>

                    {/* Valid Email */}
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="confirm-password"
                                placeholder="Confirm Password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                <div className='flex gap-3 justify-end'>
                    <Link href="/">
                        <Cancel className="mt-4 w-full">
                            Cancel <HandThumbDownIcon className="ml-2 h-5 w-5 text-gray-50" />
                        </Cancel>
                    </Link>
                    <Button className="mt-4" type='submit'>
                        Register <HandThumbUpIcon className="ml-2 h-5 w-5 text-gray-50" />
                    </Button>
                </div>
                <div className="flex h-8 items-end space-x-1" aria-live='polite' aria-atomic='true'>
                    {/* Add form errors here */}
                    {/* {errors && (
                        <>
                            <ExclamationCircleIcon className='h5 w-5 text-red-500' />
                            <p className='text-sm text-red-500'>{error}</p>
                        </>
                    )} */}
                </div>
            </div>
        </form>
    );
}