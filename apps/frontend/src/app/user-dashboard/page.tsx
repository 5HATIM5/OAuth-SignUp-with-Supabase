'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, LoadingOverlay } from '@mantine/core';

import { Navbar } from '../../components/Dashboard/Navbar/Navbar';
import { authAPI } from '../../../lib/api/auth-api';
import { sessionManager, User } from '../../../lib/auth/session';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!sessionManager.isAuthenticated()) {
      router.push('/');
      return;
    }

    // Get user data
    const userData = sessionManager.getUser();
    setUser(userData);
    setLoading(false);

    const fetchData = async () => {
      const response = await authAPI.test();
      console.log(response);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <LoadingOverlay visible={loading} />
    );
  }

  if (!user) {
    return (
      <Container size="md" py={50}>
        <Text ta="center">User data not found. Please login again.</Text>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
    </>
  );
} 