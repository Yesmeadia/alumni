// app/alumni/page.tsx
import { redirect } from 'next/navigation';

export default function AlumniPage() {
    // The primary directory is the Dashboard
    redirect('/dashboard');
}
