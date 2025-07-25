'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { IconCircleCheckFilled, IconCircleX } from '@tabler/icons-react';
import { LoadingOverlay } from '@mantine/core';

import api from '@lib/api/auth-api';
import { supabase } from '@lib/supabase/client';
import { TOKEN_KEY, USER_KEY } from '@lib/auth/session';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        notifications.show({
          title: 'Error',
          message: 'OAuth failed',
          color: 'red',
          icon: <IconCircleX size={20} />,
          position: 'top-center',
        });
        return;
      }

      // Send token and user info to your backend
      const { access_token } = session;
      const { user } = session;
      const profile = {
        email: user.email,
        fullName: user.user_metadata.name || user.user_metadata.full_name || '',
        provider: user.app_metadata.provider?.toUpperCase(),
      };

      try {
        // Call backend to create user if needed
        const res = await api.post('/auth/oauth-login', {
          ...profile,
          token: access_token,
        });

        // Store custom backend JWT (if returned)
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))

        notifications.show({
          title: 'Success',
          message: profile.provider + ' login successful!',
          color: 'green',
          icon: <IconCircleCheckFilled size={20} />,
          position: 'top-center',
        });
        
        router.push('/user-dashboard');
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'OAuth login failed. Please try again.',
          color: 'red',
          icon: <IconCircleX size={20} />,
          position: 'top-center', 
        });
        router.push('/');
      }
    };

    syncUser();
  }, []);

  return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
}
