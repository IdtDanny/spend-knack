'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  UserIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AccountSetting02Icon, AffiliateIcon } from '@/app/ui/dashboard/icon-template';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  // { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Reason', href: '/dashboard/reason', icon: ArchiveBoxIcon },
  { name: 'Expenses', href: '/dashboard/expense', icon: CreditCardIcon },
  // { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  // { name: 'My Profile', href: '/dashboard/profile', icon: AccountSetting02Icon },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div>
            <Link
              key={link.name}
              href={link.href}
              className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  'bg-sky-100 text-teal-600': pathname === link.href,
                }
              )}>
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          </div>
        );
      })}
    </>
  );
}
