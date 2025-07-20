'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/db/supabse';
import api from '../../../lib/api/auth.api.ts';
import { TOKEN_KEY, USER_KEY } from '../../../lib/auth/session';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('OAuth failed');
        return;
      }

      // Send token and user info to your backend
      const { access_token } = session;
      const { user } = session;
      console.log(user);
      const profile = {
        email: user.email || `${user.id}@facebook.com`, // Fallback email for Facebook
        name: user.user_metadata.name || user.user_metadata.full_name || '',
        nickname: user.user_metadata.user_name || user.user_metadata.name || '',
        provider: user.app_metadata.provider,
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
        router.push('/home');
      } catch (error) {
        console.error('OAuth login error:', error);
        alert('OAuth login failed. Please try again.');
        router.push('/');
      }
    };

    syncUser();
  }, []);

  return <p>Logging in...</p>;
}
