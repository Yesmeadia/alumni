import PublicLayout from '@/components/layout/PublicLayout';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Sign In - YES INDIA Alumni',
  description: 'Sign in to YES INDIA Alumni Management System',
};

export default function LoginPage() {
  return (
    <PublicLayout>
      <LoginForm />
    </PublicLayout>
  );
}
