import { fetchProfile } from '@/app/lib/data';
import Image from 'next/image';


export default async function Profile() {

  const {
    username,
    usermail,
  } = await fetchProfile();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        </div>
      </div>
    </div>
  );
}
