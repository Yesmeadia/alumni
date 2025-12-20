import Footer from '@/components/Footer';
import RegistrationForm from '@/components/registration/MultiStepRegistration';

export const metadata = {
  title: 'Alumni Registration - YES INDIA',
  description: 'Register as a YES INDIA alumni and join our growing network',
};

export default function RegisterPage() {
  return (
    <>
    <RegistrationForm />;
    <Footer />
    </>
  );
};