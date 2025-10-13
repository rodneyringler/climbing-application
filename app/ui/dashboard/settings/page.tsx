import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AccountForm from '@/app/ui-components/settings/account-form';
import ChangePasswordForm from '@/app/ui-components/settings/change-password-form';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/ui/login');
  }

  // Type assertion since we've already checked that user.id exists
  const user = session.user as { id: string; name: string; email: string };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="max-w-2xl space-y-8">
        {/* Account Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="text-gray-600 mb-4">
            Update your personal information and account details.
          </p>
          <AccountForm user={user} />
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <p className="text-gray-600 mb-4">
            Update your password to keep your account secure.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
