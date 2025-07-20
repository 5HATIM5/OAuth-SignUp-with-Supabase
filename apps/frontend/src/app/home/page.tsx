'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Paper, Group, Stack, Avatar } from '@mantine/core';
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
      <Container size="md" py={50}>
        <Text ta="center">Loading...</Text>
      </Container>
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
            <Title order={1}>Welcome to Trendies Referral System</Title>
            <Button color="red" onClick={handleLogout}>
              Logout
            </Button>
          </Group>

          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Stack gap="md">
              <Group>
                <Avatar size="lg" color="blue">
                  {user.name.charAt(0)}{user.surname.charAt(0)}
                </Avatar>
                <div>
                  <Title order={3}>{user.name} {user.surname}</Title>
                  <Text c="dimmed">@{user.nickname}</Text>
                  <Text size="sm" c="dimmed">{user.email}</Text>
                </div>
              </Group>

              <Group>
                <Text fw={600}>Role:</Text>
                <Text>{user.role}</Text>
              </Group>
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Title order={4} mb="md">Dashboard</Title>
            <Text>This is your personalized dashboard. More features coming soon!</Text>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
} 