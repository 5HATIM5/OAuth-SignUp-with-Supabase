'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Paper, Group, Stack, Avatar, LoadingOverlay } from '@mantine/core';
import { sessionManager, User } from '../../../lib/auth/session';
import { notifications } from '@mantine/notifications';
import { Navbar } from '../../../components/Dashboard/Navbar/Navbar';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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