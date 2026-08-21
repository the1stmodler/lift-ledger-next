'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AppRole, ProfileRow } from '@/lib/supabase/types';

export interface AuthProfile {
  id: string;
  pseudo: string;
  role: AppRole;
  jetonsBalance: number;
}

/**
 * Gère l'inscription, la connexion et le profil du joueur connecté.
 * `supabase.auth` prend en charge le stockage et le rafraîchissement de la
 * session automatiquement ; on écoute juste les changements pour charger
 * le profil (table `profiles`, créée automatiquement par le trigger de la
 * migration 2 dès l'inscription).
 */
export function useAuth() {
  const supabase = createClient();
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile(userId: string) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const row = data as ProfileRow | null;
      if (row) {
        setProfile({ id: row.id, pseudo: row.pseudo, role: row.role, jetonsBalance: row.jetons_balance });
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signUp(email: string, password: string, pseudo: string) {
    // `pseudo` transite en métadonnée -> lu par le trigger de création de
    // profil (migration 2) pour créer automatiquement la ligne "profiles".
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { pseudo } } });
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { profile, loading, signUp, signIn, signOut };
}
