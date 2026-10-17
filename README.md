# kejani-app-v2 — React Native app

> **New here?** See `../SETUP.md` for how to get this running locally
> (Expo), including the mock API.

Every screen from the SRS/screenshots plus what mitaa-pulse (the AI Studio
prototype) validated is wired up and navigable end to end. This is a real,
runnable screen set — not mockups — but it's a first pass: several places
call the Spring Boot API contract that isn't built yet, and those are
called out below rather than hidden.

## Screens built

| Screen | File | Notes |
|---|---|---|
| Language + phone entry | `screens/Auth/PhoneEntryScreen.tsx` | |
| OTP verification | `screens/Auth/OtpVerificationScreen.tsx` | |
| Landlord KYC (identity doc) | `screens/Onboarding/IdentityVerificationScreen.tsx` | Shown automatically for role `landlord` until submitted |
| Discover / search | `screens/Home/DiscoverScreen.tsx` + `useDiscoverViewModel.ts` | Geolocation-first, radius presets incl. "All Kenya", falls back gracefully if location is denied |
| Listing detail | `screens/Listing/ListingDetailScreen.tsx` | Address hidden until viewing confirmed |
| Confirm booking / escrow | `screens/Booking/ConfirmBookingScreen.tsx` | M-Pesa STK push UI; escrow status transition happens server-side |
| Saved listings | `screens/Saved/SavedListingsScreen.tsx` | Persisted locally via AsyncStorage, works offline |
| Enquiries list + chat | `screens/Enquiries/EnquiriesListScreen.tsx`, `ChatScreen.tsx` | Chat send is local-only until the WebSocket hookup below is done |
| Profile | `screens/Profile/ProfileScreen.tsx` + `ProfileScreenContainer.tsx` | |
| Landlord dashboard | `screens/Landlord/LandlordDashboardScreen.tsx` | Weekly stats are placeholder data — see gaps |

Navigation: `presentation/navigation/RootNavigator.tsx` switches between
Auth → (landlord KYC gate) → tenant tabs or landlord stack, driven by
`useAuthStore` (Zustand) — the one piece of real cross-screen state.

## What's genuinely incomplete (so nothing here is a surprise later)

1. **No AddListing screen yet.** The landlord dashboard's `+` button is
   wired but empty — flagged in `LandlordStack.tsx` rather than stubbed
   silently.
2. **Chat has no WebSocket wiring.** `ChatScreen.tsx` sends locally only;
   the hookup point (STOMP/SockJS to Spring Boot) is commented exactly
   where it goes.
3. **Landlord weekly stats are placeholder numbers.** Needs a real
   `GET /api/landlords/{id}/stats/weekly` endpoint.
4. **No admin moderation dashboard in this app.** That screen (the wide
   desktop "Admin Central" screenshot) is a different surface — it's a
   web-only tool for internal moderators, not something tenants/landlords
   ever see on mobile. It belongs in the `nyumbaconnect-web` project from
   the last iteration, not here. Worth confirming that split is what you
   want before I build it there.
5. **No push notifications, no offline listing cache beyond Saved.**
   Reasonable next additions, not blocking.

## Still shared with the web project

`src/domain/` and `src/data/` (minus the two files that touch RN-only
APIs — `httpClient.ts` uses `react-native-config`, `savedListingsStore.ts`
uses AsyncStorage) are line-for-line portable between this app and
`nyumbaconnect-web`. If the two projects diverge, keep entity/use-case
changes in sync manually for now — a shared npm package is the fix once
there's enough shared surface to justify it.
