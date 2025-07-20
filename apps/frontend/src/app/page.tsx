'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from "../../componenets/auth/SignUpForm";
import { sessionManager } from '../../lib/auth/session';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to home page
    if (sessionManager.isAuthenticated()) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignUpForm />
    </div>
  );
}
