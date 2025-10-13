'use client';

import { lusitana } from '@/app/ui-components/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui-components/button';
import { useActionState } from 'react';
import { updateAccountInfo } from '@/app/lib/account/account-actions';
import { useState, useEffect } from 'react';

interface AccountFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AccountForm({ user }: AccountFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(
    updateAccountInfo,
    undefined,
  );
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (errorMessage && errorMessage.includes('successfully')) {
      setSuccessMessage(errorMessage);
    } else {
      setSuccessMessage('');
    }
  }, [errorMessage]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="w-full">
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="name"
          >
            Name
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              defaultValue={user.name}
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              defaultValue={user.email}
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="currentPassword"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="currentPassword"
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              required
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Enter your current password to confirm changes
          </p>
        </div>
      </div>
      <Button className="mt-4 w-full" aria-disabled={isPending}>
        Update Account <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && !errorMessage.includes('successfully') && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
        {successMessage && (
          <>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-500">{successMessage}</p>
          </>
        )}
      </div>
    </form>
  );
}
