
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send password reset email via Firebase
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login`, // Redirect after reset
      handleCodeInApp: false,
    });

    return Response.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      return Response.json(
        { message: 'No account found with this email address' },
        { status: 404 }
      );
    }
    
    return Response.json(
      { message: 'Failed to send reset email. Please try again.' },
      { status: 500 }
    );
  }
}