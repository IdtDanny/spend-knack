// import Profile from '@/app/ui/invoices/profile';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ProfileTemp from '@/app/ui/dashboard/profile-temp';

export const metadata: Metadata = {
    title: 'Profile',
};

export default async function Page() {
    return (
        <div className="w-full">
            {/* <div className="flex w-full items-center justify-between"> */}
            {/* <h1 className={`${lusitana.className} text-2xl`}>Profile</h1> */}
            {/* </div> */}
            {/* <Profile /> */}
            <ProfileTemp />
        </div>
    );
}