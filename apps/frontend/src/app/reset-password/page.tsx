'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Anchor,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Container,
  Title,
  LoadingOverlay,
  Box,
  Button,
  Alert,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCircleCheckFilled, IconCircleX, IconAlertCircle } from '@tabler/icons-react';

import { authAPI } from '../../../lib/api/auth-api';
import { getValidationRules } from '../../../lib/auth/helpers/validate-sessions';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [token, setToken] = useState<string>('');

  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: getValidationRules('reset-password'),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setTokenValid(true);
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  const handleResetPassword = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword({
        token,
        newPassword: form.values.newPassword,
      });

      notifications.show({
        title: 'Success',
        message: 'Password reset successful! You can now login with your new password.',
        color: 'green',
        icon: <IconCircleCheckFilled size={20} />,
        position: 'top-center',
      });

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
        icon: <IconCircleX size={20} />,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <Box
        pos="relative"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Container size="sm" w="100%" maw={500} px={{ base: 16, sm: 20, md: 0 }}>
          <Text ta="center" size="lg">Loading...</Text>
        </Container>
      </Box>
    );
  }

  if (tokenValid === false) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container size="sm" w="100%" maw={500} px={{ base: 16, sm: 20, md: 0 }}>
          <Title ta="center" fw={700} size={25} c="dark.8" mb={20}>
            Invalid Reset Link
          </Title>
          <Paper withBorder shadow="sm" p={{ base: 20, sm: 30 }} radius="md" bg="white">
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Invalid or Missing Token"
              color="red"
              mb={20}
            >
              The password reset link is invalid or has expired. Please request a new password reset link.
            </Alert>
            <Button
              fullWidth
              onClick={() => router.push('/')}
              radius="md"
              size="sm"
            >
              Back to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      pos="relative"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Container
        size="sm"
        w="100%"
        maw={500}
        px={{ base: 16, sm: 20, md: 0 }}
      >
        <Title ta="center" fw={700} size={25} c="dark.8">
          Reset Your Password
        </Title>
        <Text c="dimmed" size="md" ta="center" mt={5} mb={20}>
          Enter your new password below
        </Text>

        <Paper
          withBorder
          shadow="sm"
          p={{ base: 20, sm: 30 }}
          radius="md"
          style={{ width: '100%', minWidth: '400px' }}
          bg="white"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
            <Stack gap="sm">
              <PasswordInput
                required
                label="New Password"
                placeholder="Enter your new password"
                radius="md"
                size="sm"
                {...form.getInputProps('newPassword')}
              />

              <PasswordInput
                required
                label="Confirm New Password"
                placeholder="Confirm your new password"
                radius="md"
                size="sm"
                {...form.getInputProps('confirmPassword')}
              />

              <Text size="xs" c="dimmed" ta="center" mt={5}>
                Password must be at least 8 characters long
              </Text>
            </Stack>

            <Button
              type="submit"
              fullWidth
              radius="md"
              size="sm"
              mt="lg"
              loading={loading}
            >
              Reset Password
            </Button>

            <Group justify="center" mt="lg">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => router.push('/')}
                size="xs"
              >
                Back to Login
              </Anchor>
            </Group>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container size="sm" w="100%" maw={500} px={{ base: 16, sm: 20, md: 0 }}>
          <Text ta="center" size="lg">Loading...</Text>
        </Container>
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
