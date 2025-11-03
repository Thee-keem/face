import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  // If authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // If not authenticated, redirect to login
  redirect('/auth/login');
}