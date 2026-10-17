# NyumbaConnect — web app (nyumbaconnect-web)

> **New here?** See `../SETUP.md` for how to get this running locally,
> including the mock API.

## What the market already shows (and what we're doing about it)

Looked at BuyRentKenya, Jiji, PigiaMe, Property24 KE before touching code.
The recurring complaints: listings with no verified ownership, no clear
photos, scammers posing as agents, and the property section getting no
specialized attention because the platform is a general classifieds site.
The SRS and screenshots already target exactly this gap — verified-landlord
badges, KYC with 24h manual review, escrow-held M-Pesa deposits with a
14-day refund window, and a dedicated moderation dashboard.

## Layout

```
src/
├── domain/        pure TS — entities, use-cases, repository interfaces
├── data/          Spring Boot API client, DTOs, mappers, repository impls
├── presentation/  screens, ViewModel hooks, components (React web)
└── core/          theme tokens, constants, i18n, utils
```

`domain/` and `data/` here are line-for-line portable with the
`kejani-app-v2` React Native app, minus the two files that touch
browser-only APIs (`data/api/httpClient.ts` uses `import.meta.env`).

## Screens built

- **Home / Discover** (`presentation/screens/Home/useHomeViewModel.ts`) —
  geolocation-first search, works for any Kenyan town.
- **Admin moderation dashboard**
  (`presentation/screens/Admin/AdminDashboardScreen.tsx`) — the desktop
  governance view: stat cards (pending verifications, flagged listings,
  active users, revenue), a flagged-listings queue with inline
  approve/reject, a market-velocity chart (new listings vs bookings), and
  recent KYC submissions with one-tap verify. `regionId` is threaded
  through `AdminRepository` and the ViewModel rather than hardcoded to
  Nairobi — same principle as the tenant app's "not just Nairobi"
  geolocation search, so a Mombasa or Kisumu regional moderation team can
  use the same screen later.

Deliberately kept on the web rather than in `kejani-app-v2`'s mobile app:
the admin dashboard is a dense, wide-table tool for internal moderators,
and a phone screen would fight the information density that makes it
usable.

## What's genuinely incomplete

- Bulk actions on the moderation queue (only single-ticket approve/reject
  exist).
- The "Dispute Management" and "Reports" sidebar items visible in the
  reference screenshot, and the Emergency Lockout control — not built.
- Tenant-facing screens beyond Home/Discover (listing detail, booking,
  chat, saved, profile) exist in `kejani-app-v2` for mobile; they haven't
  been ported to this web app. Say if you want tenant-facing web parity
  too, or if web stays admin-only going forward.

## Next up

Pick a screen and I'll build it fully wired: the remaining admin sidebar
sections, or porting the tenant screens from the mobile app to web.
