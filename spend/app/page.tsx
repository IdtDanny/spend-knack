import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { CopyrightIcon } from '@/app/ui/dashboard/icon-template';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6">

            {/* <div className={styles.shape} /> */}

            <div className="flex h-20 shrink-0 items-end rounded-lg bg-teal-700 p-4 md:h-32">
                <AcmeLogo />
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">

                    {/* <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" /> */}

                    <p className={`${lusitana.className} text-xl text-gray-800 md:text-xl md:leading-normal`}>
                        <strong>Welcome to SpendKnack.</strong> <br />
                        Transform your financial journey with our innovative solution, crafted to simplify budgeting, saving, and expense tracking.
                    </p>
                    <div className='flex gap-2'>
                        <Link href="login" className="flex items-center gap-5 self-start rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 md:text-base">
                            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                        <Link href="register" className="flex items-center gap-5 self-start rounded-lg bg-orange-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-800 md:text-base">
                            <span>Register</span> <UserPlusIcon className="w-5 md:w-6" />
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                    {/* Add Hero Images Here */}
                    <Image
                        src='/header.png'
                        width={450}
                        height={200}
                        className='hidden md:block'
                        alt='Screenshots of the dashboard project showing desktop version'
                    />

                    <Image
                        src='/header.png'
                        width={560}
                        height={620}
                        className='block md:hidden'
                        alt='Screenshots of the dashboard project showing mobile version'
                    />
                </div>
            </div>
            <CopyrightIcon className={`text-l text-gray-600`} />
        </main>
    );
}
