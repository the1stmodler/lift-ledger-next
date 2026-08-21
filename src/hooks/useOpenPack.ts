'use client';

import { createClient } from '@/lib/supabase/client';

/**
 * Ouverture d'un pack de cartes. Le tirage pondéré, le débit de jetons et
 * l'attribution des cartes sont entièrement gérés dans la fonction
 * Postgres `open_pack` (migration 4) — atomique nativement.
 *
 * Brancher directement sur `handleBuy()` dans app/cards/page.tsx à la
 * place de la simulation locale `drawCards()` :
 *
 *   const { openPack } = useOpenPack();
 *   const drawn = await openPack(packId); // -> alimente <PackOpeningModal cards={...} />
 */
export function useOpenPack() {
  const supabase = createClient();

  async function openPack(packTypeId: string) {
    const { data, error } = await supabase.rpc('open_pack', { p_pack_type_id: packTypeId });
    if (error) throw error;
    return data; // [{ user_card_id, card_template_id, tier }, ...]
  }

  return { openPack };
}
