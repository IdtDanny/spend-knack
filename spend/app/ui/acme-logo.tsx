// import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { SavingsIcon } from '@/app/ui/dashboard/account-setting-02-stroke-rounded';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      {/* <SavingsIcon className='text-white mr-5 ml-2' /> */}
      <Image
            src='/header.png'
            width={35}
            height={10}
            className='mr-3'
            alt='Screenshots of the dashboard project showing desktop version'
          />
      <p className="text-[30px]">SpendKnack</p>
    </div>
  );
}
