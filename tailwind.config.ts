import type { Config } from 'tailwindcss';

/**
 * Design system extrait 1:1 des variables CSS du prototype Lift Ledger
 * (:root{...} du fichier HTML source). Les valeurs de couleur/rayon/police
 * sont reprises à l'identique pour garantir un look & feel inchangé.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'], // l'app est mono-thème sombre (voir globals.css `color-scheme: only dark`)
  theme: {
    extend: {
      colors: {
        void: '#05070A',
        steel: {
          1: '#14161C',
          2: '#1B1E25',
          3: '#262A33',
        },
        metal: {
          line: 'rgba(255,255,255,0.08)',
          lineStrong: 'rgba(255,255,255,0.16)',
        },
        platinum: '#EDEEF1',
        mute: {
          DEFAULT: '#8A93A3',
          dim: '#535A65',
        },
        electric: {
          DEFAULT: '#2E7CF6',
          bright: '#6FA8FF',
          violet: '#7A5CF6',
          soft: 'rgba(46,124,246,0.14)',
          line: 'rgba(46,124,246,0.45)',
        },
        // Couleurs dédiées par mouvement de streetlifting (jauges, badges)
        move: {
          mu: '#FF9F43',
          pu: '#4FBF8F',
          dips: '#FF6B5B',
          sq: '#5B9BFF',
          proj: '#FFB020',
        },
        signal: {
          DEFAULT: '#FF4B2E',
          soft: 'rgba(255,75,46,0.14)',
        },
        silver: '#AEB6C2',
        bronze: '#9C6B42',
        good: '#4FBF8F',
        glass: {
          DEFAULT: 'rgba(5,7,10,0.75)',
          strong: 'rgba(20,22,28,0.92)',
        },
      },
      fontFamily: {
        // Anton = titres impactants (bannières, chiffres), Inter = corps de
        // texte, JetBrains Mono = labels techniques / mono (RIS, chronos).
        display: ['Anton', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        s: '3px',
        m: '6px',
        l: '10px',
        xl: '16px',
      },
      boxShadow: {
        ambient: '0 20px 60px rgba(0,0,0,0.55)',
      },
      backgroundImage: {
        'grad-electric': 'linear-gradient(135deg, #2E7CF6, #7A5CF6)',
        'grad-metal':
          'linear-gradient(120deg, #E8EAED 0%, #9AA0A8 22%, #5F656D 40%, #C7CCD1 55%, #83898F 72%, #F2F3F5 90%, #A8AEB6 100%)',
      },
      keyframes: {
        // Reflet holographique qui balaie une carte au survol (foil sheen)
        'pack-sheen': {
          '0%': { transform: 'translateX(-40%) rotate(18deg)' },
          '100%': { transform: 'translateX(220%) rotate(18deg)' },
        },
        // Maillage holographique animé en fond de carte
        'holo-drift': {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '60px 0, -60px 0' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        // Gain de jetons : le texte "+X JT" flotte puis s'efface
        'jeton-float': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(.85)' },
          '15%': { opacity: '1', transform: 'translateY(-2px) scale(1.08)' },
          '75%': { opacity: '1', transform: 'translateY(-22px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-30px) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pack-sheen': 'pack-sheen 1.1s ease-out',
        'holo-drift': 'holo-drift 7s linear infinite',
        'pulse-ring': 'pulse-ring 1.4s infinite',
        'jeton-float': 'jeton-float 1.1s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
