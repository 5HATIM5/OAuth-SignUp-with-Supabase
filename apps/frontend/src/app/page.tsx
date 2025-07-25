'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';

import SignUpForm from "../../components/Auth/SignUpForm";
import { sessionManager } from '../../lib/auth/session';


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect authenticated users to home page
    if (sessionManager.isAuthenticated()) {
      router.push('/user-dashboard');
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [router]);

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SignUpForm />
    </div>
  );
}
