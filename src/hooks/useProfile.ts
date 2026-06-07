import { useEffect, useState } from 'react';
import { getProfile } from '@/services/profile';
import type { Profile } from '@/types';

export function useProfile(userId?: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getProfile(userId)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading };
}
