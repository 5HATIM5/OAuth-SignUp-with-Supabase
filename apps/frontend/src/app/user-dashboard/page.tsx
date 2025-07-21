'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Paper, Group, Stack, Avatar, LoadingOverlay } from '@mantine/core';
import { sessionManager, User } from '../../../lib/auth/session';
import { notifications } from '@mantine/notifications';

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

  const handleLogout = () => {

    notifications.show({
      title: 'Logout',
      message: 'You have been logged out',
      color: 'red',
    });
    
    sessionManager.logout(router);
  };

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
    <Container size="md" py={50}>
      <Paper shadow="sm" p="xl" radius="md" bg="white">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={1}>Welcome {user.name} {user.surname}</Title>
            <Button color="red" onClick={handleLogout}>
              Logout
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 