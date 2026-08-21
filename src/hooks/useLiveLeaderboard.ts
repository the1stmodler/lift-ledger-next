'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LeaderboardRow } from '@/types';

/**
 * Classement en direct d'une catégorie, synchronisé en temps réel.
 *
 * Fonctionnement :
 *   1. Chargement initial via une requête classique.
 *   2. Abonnement Realtime sur athlete_entries filtré par catégorie : dès
 *      qu'un essai est validé (le Total de l'athlète est mis à jour),
 *      Supabase pousse automatiquement la ligne modifiée à ce hook — sans
 *      code de diffusion à écrire côté serveur.
 *
 * Alimente directement <LiveRankList rows={...} /> — ce composant reste
 * purement présentationnel, il ne sait pas d'où viennent ses données.
 */
export function useLiveLeaderboard(categoryId: string) {
  const supabase = createClient();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    if (!categoryId) return;

    let active = true;

    async function loadInitial() {
      const { data } = await supabase
        .from('athlete_entries')
        .select('id, current_total, athletes(first_name, last_name), categories(weight_kg, gender)')
        .eq('category_id', categoryId)
        .order('current_total', { ascending: false });

      if (active && data) {
        setRows(
          data.map((entry: any) => ({
            athleteEntryId: entry.id,
            name: `${entry.athletes.first_name[0]}. ${entry.athletes.last_name}`,
            // Limite connue : ce schéma minimal ne distingue pas les catégories
            // "+101kg" des catégories "-66kg" (pas de colonne de signe dédiée).
            // À affiner plus tard si besoin, en ajoutant ex. categories.weight_sign.
            weightLabel: `-${entry.categories.weight_kg} KG`,
            currentTotal: entry.current_total,
          })),
        );
      }
    }

    loadInitial();

    const channel = supabase
      .channel(`leaderboard:${categoryId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'athlete_entries', filter: `category_id=eq.${categoryId}` },
        (payload) => {
          setRows((prev) =>
            prev
              .map((r) => (r.athleteEntryId === payload.new.id ? { ...r, currentTotal: payload.new.current_total } : r))
              .sort((a, b) => b.currentTotal - a.currentTotal),
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  return rows;
}
