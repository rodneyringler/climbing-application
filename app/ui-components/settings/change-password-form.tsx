'use client';

import { lusitana } from '@/app/ui-components/fonts';
import {
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui-components/button';
import { useActionState, useState, useEffect } from 'react';
import { changePassword } from '@/app/lib/account/account-actions';
import { validatePassword, getPasswordStrength } from '@/app/lib/utils';

export default function ChangePasswordForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    changePassword,
    undefined,
  );
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  useEffect(() => {
    if (errorMessage && errorMessage.includes('successfully')) {
      setSuccessMessage(errorMessage);
    } else {
      setSuccessMessage('');
    }
  }, [errorMessage]);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const confirmPassword = (e.target.form?.elements.namedItem('confirmPassword') as HTMLInputElement)?.value;
    setPasswordMatch(password === confirmPassword);
    
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    const password = (e.target.form?.elements.namedItem('newPassword') as HTMLInputElement)?.value;
    setPasswordMatch(password === confirmPassword);
  };

  const isFormValid = passwordMatch && passwordStrength.score >= 3;

  return (
    <form action={formAction} className="space-y-3">
      <div className="w-full">
        <div>
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
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              required
              onChange={handleNewPasswordChange}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {passwordStrength.label && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{passwordStrength.label}</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              required
              onChange={handleConfirmPasswordChange}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {!passwordMatch && (
            <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
          )}
        </div>
        <div className="mt-4 p-3 bg-sage-50 rounded-md">
          <h4 className="text-sm font-medium text-sage-900 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-sage-800 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase and lowercase letters</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character</li>
          </ul>
        </div>
      </div>
      <Button 
        className="mt-4 w-full" 
        aria-disabled={isPending || !isFormValid}
        disabled={isPending || !isFormValid}
      >
        Change Password <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
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
