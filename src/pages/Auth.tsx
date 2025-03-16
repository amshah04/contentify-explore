
import { AuthTabs } from "@/components/auth/auth-tabs";

export default function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <AuthTabs />
      </div>
    </div>
  );
}
