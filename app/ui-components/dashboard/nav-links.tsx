'use client';

import {
  UserGroupIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', href: '/ui/dashboard', icon: MapPinIcon },
  { name: 'Categories', href: '/ui/dashboard/categories', icon: DocumentDuplicateIcon },
  { name: 'Exercises', href: '/ui/dashboard/exercises', icon: DocumentDuplicateIcon },
  { name: 'Programs', href: '/ui/dashboard/programs', icon: UserGroupIcon },
  { name: 'Workouts', href: '/ui/dashboard/workouts', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/ui/dashboard/settings', icon: Cog6ToothIcon },
];

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-1 px-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onNavigate}
            className={clsx(
              'flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-sage-100 text-sage-700'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700',
            )}
          >
            <LinkIcon className="w-5 h-5 flex-none" />
            <span className="whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
