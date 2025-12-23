// app/login/page.tsx
import LoginForm from '@/components/LoginForm';


export const metadata = {
  title: 'Login - YES INDIA',
  description: 'Sign in to YES INDIA Alumni Management System',
};

export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
