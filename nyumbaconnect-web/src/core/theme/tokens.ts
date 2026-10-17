/**
 * NyumbaConnect Design Tokens
 * -----------------------------------------------------------------------
 * Palette is named after the materials it's drawn from, not generic
 * "primary/secondary" labels — this keeps design decisions traceable
 * back to the brief (Kenyan rental market, dark green + brown identity).
 *
 * msitu   = Kiswahili for "forest"      -> deep green, trust/verification
 * udongo  = Kiswahili for "clay/soil"   -> earthy brown, structure/cards
 * sisal   = fibre used in East African weaving -> warm ochre, calls to action
 * kanga   = printed cotton cloth        -> the thin double-rule border
 *           motif used as the app's one signature device (see Divider)
 */

export const color = {
  msitu900: '#081C15', // near-black forest green — status bars, deepest surfaces
  msitu700: '#1B4332', // primary brand green — buttons, active states, verified badge
  msitu500: '#2D6A4F', // lighter "safari" green — secondary accents, dark-mode primary
  msitu100: '#D8F3DC', // pale sage — success chips, KYC-approved surfaces

  udongo700: '#4E3629', // rich coffee brown — headings on light, borders on dark
  udongo400: '#9E6B43', // rift-valley clay — card outlines, secondary buttons, icons
  udongo100: '#F5EBE0', // sandy dune — warm input/section backgrounds

  sisal600: '#C1652F', // ochre/terracotta CTA — "Call agent", "Pay", primary actions
  sisal500: '#D97706', // hover/active state for CTA

  parchment: '#FAF7F2', // app background — warm wheat-grain, not clinical white
  border: '#E6DFD5', // hairline dividers
  ink: '#1C221F', // primary text — near-black with a green cast
  inkMuted: '#6B7570', // secondary text

  alert: '#B3261E', // scam/flag warnings, destructive actions
  mpesaGreen: '#46B422', // Safaricom-recognizable accent, M-Pesa CTAs only
  escrowGold: '#FFB703', // escrow "held" / pending states
  boost: '#9E6B43', // featured/boosted-listing ribbon — reuses udongo400, not a new hue
} as const;

/** Escrow lifecycle — mirrors the backend `EscrowTransaction.status` enum,
 *  kept as a literal union here so UI and API can't drift out of sync. */
export type EscrowStatus = 'HELD' | 'RELEASED' | 'REFUNDED';

export const type = {
  // Display: a warm slab-serif with real character for headlines & prices —
  // avoids the generic geometric-sans-everywhere look.
  display: "'Fraunces', 'Georgia', serif",
  // Body: humanist sans, tuned for Kiswahili/English bilingual copy and
  // small-screen legibility on lower-end Android devices common in market.
  body: "'Work Sans', -apple-system, sans-serif",
  // Data/mono: prices, phone numbers, M-Pesa codes — tabular figures.
  data: "'IBM Plex Mono', monospace",
} as const;

export const radius = {
  sm: '6px',
  md: '10px',
  pill: '999px',
} as const;

export const spacing = (n: number) => `${n * 4}px`;

export const shadow = {
  card: '0 1px 2px rgba(15,46,32,0.06), 0 1px 0 rgba(15,46,32,0.08)',
};
