import Pagination from '@/app/ui/expenses/pagination';
import Search from '@/app/ui/search';
import { ReasonTable } from '@/app/ui/expenses/table-expense';
import { CreateReason } from '@/app/ui/expenses/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ReasonsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchReasonPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reason',
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string,
        page?: string,
    },
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchReasonPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Reason</h1>
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search reason..." />
                <CreateReason />
            </div>
            <Suspense key={query + currentPage} fallback={<ReasonsTableSkeleton />}>
                <ReasonTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}