// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// import {
//   Anchor,
//   Divider,
//   Group,
//   Paper,
//   PaperProps,
//   PasswordInput,
//   Stack,
//   Text,
//   TextInput,
//   Container,
//   Title,
//   LoadingOverlay,
//   Box,
//   Button,
// } from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { upperFirst, useToggle } from '@mantine/hooks';
// import { notifications } from '@mantine/notifications';
// import { IconCircleCheckFilled, IconCircleX } from '@tabler/icons-react';

// import { FacebookButton } from '../Buttons/FacebookButton';
// import { GoogleButton } from '../Buttons/GoogleButton';
// import { supabase } from '../../lib/supabase/client';
// import { getValidationRules } from '../../lib/auth/helpers/validate-sessions';
// import { authAPI } from '../../lib/api/auth-api';
// import { sessionManager } from '../../lib/auth/session';

// export default function SignUpForm(props: PaperProps) {
//   const [type, toggle] = useToggle(['login', 'register']);
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const form = useForm({
//     initialValues: {
//       name: '',
//       surname: '',
//       email: '',
//       dateOfBirth: '',
//       password: '',
//       confirmPassword: '',
//       phoneNo: '',
//       terms: true,
//     },
//     validate: getValidationRules(type),
//   });

//   const handleSubmit = async (e?: React.FormEvent) => {
//     if (e) {
//       e.preventDefault();
//     }

//     // Validate form before submission
//     const validation = form.validate();
//     if (validation.hasErrors) {
//       const messages = {
//         login: 'Please enter a valid email and password',
//         register: 'Please fill in all required fields'
//       } as const;
//       return;
//     }

//     setLoading(true);

//     try {
//       if (type === 'register') {
//         // Handle registration
//         const response = await authAPI.register({
//           name: form.values.name,
//           surname: form.values.surname,
//           dateOfBirth: form.values.dateOfBirth,
//           email: form.values.email.trim().toLowerCase(),
//           password: form.values.password,
//           phoneNo: form.values.phoneNo,
//         });
        
//         router.push('/user-dashboard');

//         // Save session data
//         sessionManager.setAuth(response, response.user);

//         notifications.show({
//           title: 'Success',
//           message: 'Registration successful!',
//           color: 'green',
//           icon: <IconCircleCheckFilled size={20} />,
//           position: 'top-center',
//         });
//       } else {
//         // Handle login
//         const response = await authAPI.login({
//           email: form.values.email,
//           password: form.values.password,
//         });

//         // Save session data
//         sessionManager.setAuth(response, response.user);

//         notifications.show({
//           title: 'Success',
//           message: 'Login successful!',
//           color: 'green',
//           icon: <IconCircleCheckFilled size={20} />,
//           position: 'top-center',
//         });

//         router.push('/user-dashboard');
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.error?.message?.message || 'Authentication failed';
//       notifications.show({
//         title: 'Error',
//         message: errorMessage,
//         color: 'red',
//         icon: <IconCircleX size={20} />,
//         position: 'top-center',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWith = async (provider: 'google' | 'facebook' | 'github' | 'linkedin') => {
//     await supabase.auth.signInWithOAuth({
//       provider,
//       options: {
//         redirectTo: 'http://localhost:3000/o-auth',
//       },
//     });
//   };

//   return (
//     <Box pos="relative">
//       <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

//       <Container
//         size="sm"
//         w="100%"
//         maw={500}
//         my={20}
//         px={{ base: 16, sm: 20, md: 0 }}
//       >
//         <Title ta="center" fw={700} size={25} c="dark.8">
//           Happy To See You !
//         </Title>
//         <Text c="dimmed" size="md" ta="center" mt={5} mb={20}>
//           {type === 'register'
//             ? 'Create your account to get started'
//             : 'Sign in to your account'
//           }
//         </Text>

//         <Paper
//           withBorder
//           shadow="sm"
//           p={{ base: 20, sm: 30 }}
//           radius="md"
//           style={{ width: '100%', minWidth: '400px' }}
//           bg="white"
//           {...props}
//         >

//           {
//             type === 'login' && (
//               <>
//                 <Group grow mb="md" mt="md">
//                   <GoogleButton radius="xl" onClick={() => loginWith('google')}>Google</GoogleButton>
//                   <FacebookButton radius="xl" onClick={() => loginWith('facebook')}>Facebook</FacebookButton>
//                 </Group>
//                 {/* <Group grow mb="md" mt="md">
//                   <GithubButton radius="xl" onClick={() => loginWith('github')}>Github</GithubButton>
//                   <LinkedInButton radius="xl" onClick={() => loginWith('linkedin')}>LinkedIn</LinkedInButton>
//                 </Group> */}

//                 <Divider label="Or continue with email" labelPosition="center" my="md" />

//               </>
//             )
//           }


//           <form onSubmit={handleSubmit}>
//             <Stack gap="sm">
//               {type === 'register' && (
//                 <>
//                   <Group grow gap="sm" wrap="wrap">
//                     <TextInput
//                       required
//                       label="Name"
//                       placeholder="e.g. John"
//                       radius="md"
//                       size="sm"
//                       style={{ flex: 1, minWidth: 200 }}
//                       {...form.getInputProps('name')}
//                     />
//                     <TextInput
//                       required
//                       label="Surname"
//                       placeholder="e.g. Doe"
//                       radius="md"
//                       size="sm"
//                       style={{ flex: 1, minWidth: 200 }}
//                       {...form.getInputProps('surname')}
//                     />
//                   </Group>

//                   <Group grow gap="sm" wrap="wrap">
//                     <TextInput
//                       required
//                       label="Date of Birth"
//                       type="date"
//                       max={new Date().toISOString().split('T')[0]}
//                       radius="md"
//                       size="sm"
//                       style={{ flex: 1, minWidth: 200 }}
//                       {...form.getInputProps('dateOfBirth')}
//                     />
//                     <TextInput
//                       required
//                       label="Phone Number"
//                       placeholder="e.g. +49 157 777 77 77"
//                       type='tel'
//                       radius="md"
//                       size="sm"
//                       value={form.values.phoneNo}
//                       style={{ flex: 1, minWidth: 200 }}
//                       {...form.getInputProps('phoneNo')}
//                     />
//                   </Group>
//                 </>
//               )}

//               <TextInput
//                 required
//                 label="Email"
//                 placeholder="e.g. jhon.doe@gmail.com"
//                 radius="md"
//                 size="sm"
//                 {...form.getInputProps('email')}
//               />

//               <PasswordInput
//                 required
//                 label="Password"
//                 placeholder="Your password"
//                 radius="md"
//                 size="sm"
//                 {...form.getInputProps('password')}
//               />

//               {type === 'register' && (
//                 <PasswordInput
//                   required
//                   label="Confirm Password"
//                   placeholder="Confirm your password"
//                   radius="md"
//                   size="sm"
//                   {...form.getInputProps('confirmPassword')}
//                 />
//               )}

//               {type === 'register' && (
//                 <Text size="xs" fw={600} c="dimmed" ta="center" mt={5}>
//                   By signing up, you accept our{' '}
//                   <Anchor href="/terms" size="xs">
//                     Terms of Service
//                   </Anchor>{' '}
//                   and{' '}
//                   <Anchor href="/privacy" size="xs">
//                     Privacy Policy
//                   </Anchor>
//                 </Text>
//               )}
//             </Stack>

//             <Group justify="space-between" mt="lg" wrap="wrap" gap="sm">
//               <Anchor
//                 component="button"
//                 type="button"
//                 c="dimmed"
//                 onClick={() => toggle()}
//                 size="xs"
//                 style={{ textAlign: 'center' }}
//               >
//                 {type === 'register'
//                   ? 'Already have an account? Login'
//                   : "Don't have an account? Register"}
//               </Anchor>
//               <Button type="submit" radius="md" size="sm" loading={loading}>
//                 {upperFirst(type)}
//               </Button>
//             </Group>
//           </form>
//         </Paper>
//       </Container>
//     </Box>

//   );
// }
