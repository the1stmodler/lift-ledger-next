'use client';

import { useEffect, useState } from 'react';

interface JetonGainToastProps {
  /** Change de valeur (même si le montant est identique) pour redéclencher l'animation. */
  triggerKey: number;
  amount: number;
}

/**
 * Toast flottant "+X JT" affiché brièvement après une bonne réponse.
 * `triggerKey` doit changer à chaque nouvelle récompense (ex: un compteur
 * incrémenté par le parent) pour rejouer l'animation même si `amount` est
 * identique à la fois précédente.
 */
export default function JetonGainToast({ triggerKey, amount }: JetonGainToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 1150);
    return () => clearTimeout(id);
  }, [triggerKey]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-8 z-20 flex -translate-x-1/2 items-center gap-1.5 font-mono text-base font-extrabold text-[#FFD34E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] animate-jeton-float">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v9M9 9.5h4a1.8 1.8 0 0 1 0 3.6H9.5a1.8 1.8 0 0 0 0 3.6H15" />
      </svg>
      +{amount} JT
    </div>
  );
}
