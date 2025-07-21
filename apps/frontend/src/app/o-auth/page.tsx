'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import api from '../../../lib/api/auth-api';
import { TOKEN_KEY, USER_KEY } from '../../../lib/auth/session';
import { notifications } from '@mantine/notifications';

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
        router.push('/user-dashboard');
      } catch (error) {
        console.error('OAuth login error:', error);
        notifications.show({
          title: 'Error',
          message: 'OAuth login failed. Please try again.',
          color: 'red',
        });
        router.push('/');
      }
    };

    syncUser();
  }, []);

  return <p>Logging in...</p>;
}
