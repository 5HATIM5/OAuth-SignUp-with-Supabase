'use client';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Container,
  Title,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { FacebookButton } from './buttons/facebookButton';
import { GoogleButton } from './buttons/googleButton';

export default function SignUpForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);

  // Define validation rules based on form type
  const getValidationRules = () => {
    const baseRules = {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) => (val.length < 6 ? 'Password must be at least 6 characters' : null),
    };

    if (type === 'register') {
      return {
        ...baseRules,
        name: (val: string) => (val.length < 1 ? 'Name is required' : null),
        surname: (val: string) => (val.length < 1 ? 'Surname is required' : null),
        nickname: (val: string) => (val.length < 1 ? 'Nickname is required' : null),
        dateOfBirth: (val: string) => (val.length < 1 ? 'Date of birth is required' : null),
        confirmPassword: (val: string, values: any) => val !== values.password ? 'Passwords do not match' : null,
      };
    }

    return baseRules;
  };

  const form = useForm({
    initialValues: {
      name: '',
      surname: '',
      nickname: '',
      email: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      referralCode: '761232',
      terms: true,
    },
    validate: getValidationRules(),
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validate form before submission
    const validation = form.validate();
    if (validation.hasErrors) {
      const messages = {
        login: 'Please enter a valid email and password',
        register: 'Please fill in all required fields'
      } as const;
      alert(messages[type as keyof typeof messages]);
      return;
    }

    try {
      // Handle form submission here
      console.log('Form values:', form.values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Container
      size="sm"
      w="100%"
      maw={500}
      my={20}
      px={{ base: 16, sm: 20, md: 0 }}
    >
      <Title ta="center" fw={900} size={25}>
        Welcome to Referal System
      </Title>
      <Text c="dimmed" size="md" ta="center" mt={5} mb={20}>
        {type === 'register'
          ? 'Create your account to get started'
          : 'Sign in to your account'
        }
      </Text>

      <Paper
        withBorder
        shadow="sm"
        p={{ base: 20, sm: 30 }}
        radius="md"
        {...props}
      >
        {type === 'login' && (
          <>
            <Group grow mb="md" mt="md">
              <GoogleButton radius="xl">Google</GoogleButton>
              <FacebookButton radius="xl">Facebook</FacebookButton>
            </Group>
            <Divider label="Or continue with email" labelPosition="center" my="md" />
          </>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            {type === 'register' && (
              <>
                <Group grow gap="sm" wrap="wrap">
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    radius="md"
                    size="sm"
                    style={{ flex: 1, minWidth: 200 }}
                    {...form.getInputProps('name')}
                  />
                  <TextInput
                    label="Surname"
                    placeholder="Your surname"
                    radius="md"
                    size="sm"
                    style={{ flex: 1, minWidth: 200 }}
                    {...form.getInputProps('surname')}
                  />
                </Group>

                <TextInput
                  label="Nickname"
                  placeholder="Your nickname"
                  radius="md"
                  size="sm"
                  {...form.getInputProps('nickname')}
                />

                <Group grow gap="sm" wrap="wrap">
                  <TextInput
                    label="Date of Birth"
                    type="date"
                    radius="md"
                    size="sm"
                    style={{ flex: 1, minWidth: 200 }}
                    {...form.getInputProps('dateOfBirth')}
                  />
                  <TextInput
                    label="Referral Code"
                    placeholder="Referral code"
                    radius="md"
                    size="sm"
                    disabled
                    value={form.values.referralCode}
                    style={{ flex: 1, minWidth: 200 }}
                    {...form.getInputProps('referralCode')}
                  />
                </Group>
              </>
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@trendies.com"
              radius="md"
              size="sm"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              radius="md"
              size="sm"
              {...form.getInputProps('password')}
            />

            {type === 'register' && (
              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                radius="md"
                size="sm"
                {...form.getInputProps('confirmPassword')}
              />
            )}

            {type === 'register' && (
              <Text size="xs" fw={600} c="dimmed" ta="center" mt={5}>
                By signing up, you accept our{' '}
                <Anchor href="/terms" size="xs">
                  Terms of Service
                </Anchor>{' '}
                and{' '}
                <Anchor href="/privacy" size="xs">
                  Privacy Policy
                </Anchor>
              </Text>
            )}
          </Stack>

          <Group justify="space-between" mt="lg" wrap="wrap" gap="sm">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
              style={{ textAlign: 'center' }}
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="md" size="sm">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}