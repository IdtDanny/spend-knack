import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import { CopyrightIcon } from '@/app/ui/dashboard/icon-template';

<link rel="icon" href="favicon.ico" />

export const metadata: Metadata = {
    title: {
        template: '%s | SpendKnack',
        default: 'SpendKnack',
    },
    description: 'The official SpendKnack built with App Router.',
    metadataBase: new URL('https://spend-knack.vercel.app/'),
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
