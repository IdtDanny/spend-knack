import { Metadata } from 'next';
import { ProfileTemp } from '@/app/ui/dashboard/profile-temp';

export const metadata: Metadata = {
    title: 'Profile',
};

export default async function Page() {
    return (
        <div className="w-full">
            <ProfileTemp />
        </div>
    );
}