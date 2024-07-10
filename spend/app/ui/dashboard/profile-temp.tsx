import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchProfileTemp } from '@/app/lib/data';

export default async function ProfileTemp() {

    const profileTemp = await fetchProfileTemp();

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Profile Template
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: Uncomment this code in Chapter 9 */}

                <div className="bg-white px-6">
                    {profileTemp.map((profile, i) => {
                        return (
                            <div
                                key={profile.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    {/* <Image
                                        src={profile.image_url}
                                        alt={`${profile.name}'s profile picture`}
                                        className="mr-4 rounded-full"
                                        width={32}
                                        height={32}
                                    /> */}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {profile.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {profile.email}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {/* {profile.amount} */}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
