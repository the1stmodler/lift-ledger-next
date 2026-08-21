'use client';

import { useEffect, useState } from 'react';
import { secondsUntil } from '@/lib/utils';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  /** false tant que le composant n'a pas encore terminé son premier rendu
   *  client — voir la note sur l'hydratation SSR ci-dessous. */
  mounted: boolean;
}

/**
 * Hook de compte à rebours réutilisable, factorisé à partir du pattern
 * introduit dans `HeroBanner.tsx`. Utilisé par : bannière héro, sas
 * d'attente Live Game, minuteur du PredictPanel (variante avec durée fixe),
 * verrous de packs boutique, etc.
 *
 * ⚠️ Piège SSR : ne JAMAIS calculer `secondsUntil(targetDate)` pendant le
 * rendu initial (le serveur et le client obtiendraient des valeurs
 * différentes à quelques secondes d'écart -> erreur d'hydratation React
 * #418/#423/#425, déjà rencontrée et corrigée dans ce projet). On
 * initialise donc à 0 et on calcule la vraie valeur uniquement dans
 * useEffect, après le montage côté client. Le consommateur du hook doit
 * utiliser `mounted` pour éviter d'afficher "00:00:00" avant la vraie valeur
 * (voir exemple d'utilisation dans HeroBanner.tsx).
 */
export function useCountdown(targetDateIso: string): CountdownParts {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTotalSeconds(secondsUntil(targetDateIso));
    const id = setInterval(() => setTotalSeconds(secondsUntil(targetDateIso)), 1000);
    return () => clearInterval(id);
  }, [targetDateIso]);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: Math.floor(totalSeconds % 60),
    totalSeconds,
    mounted,
  };
}
