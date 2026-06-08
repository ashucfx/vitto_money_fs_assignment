/**
 * LanguageBadge — coloured pill badge for preferred language.
 *
 * Props:
 *   language — 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'English'
 */

export default function LanguageBadge({ language }) {
  return (
    <span className={`lang-badge lang-badge--${language.toLowerCase()}`}>
      {language}
    </span>
  );
}
