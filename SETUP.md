# Getting Kejani / NyumbaConnect running locally

This folder has three separate things in it, each covered below in the order
you'll actually need them:

1. **`mock-api/`** — a small local stand-in for the real Spring Boot backend
   (which hasn't been built yet). Start this first — both apps below expect
   something answering at `localhost:4000`.
2. **`nyumbaconnect-web/`** — the admin moderation dashboard (browser, React + Vite).
3. **`kejani-app-v2/`** — the tenant/landlord mobile app (React Native).

Do them in that order. The web app takes five minutes. The mobile app takes
longer because React Native needs native tooling installed — that's not
optional complexity I added, it's what RN requires to run on a phone/simulator.

---

## 0. Prerequisites

| Tool | Needed for | Check with |
|---|---|---|
| Node.js 18+ | all three | `node -v` |
| npm | all three | `npm -v` |
| A modern browser | web app | — |
| **Expo Go** app on your phone (App Store / Play Store) | mobile app — easiest path, no SDK install | — |
| Android Studio or Xcode | mobile app — only if you want an emulator/simulator instead of a physical phone | see step 3 |

If you only want to see the admin dashboard, skip straight to step 2.

---

## 1. Start the mock API

```bash
cd mock-api
npm install
npm start
```

You should see:
```
Mock Kejani/NyumbaConnect API running at http://localhost:4000
```

Leave this running in its own terminal for the rest of this guide. It serves
canned listings, moderation tickets, and KYC submissions so both apps show
real-looking data instead of blank error states on first run.

**This is a stand-in, not the real backend.** It has no database, no auth,
no M-Pesa integration, and resets every time you restart it. It exists so
you can see the UI work end to end while the actual Spring Boot service
(discovery/escrow/booking, per the architecture notes in each app's README)
gets built separately.

---

## 2. Run the admin dashboard (web)

```bash
cd nyumbaconnect-web
npm install
cp .env.example .env.local
```

Open `.env.local` and confirm:
```
VITE_API_BASE_URL=http://localhost:4000
```
(the `.env.example` template points at a production-shaped URL — change it
for local dev, that's what the copy is for).

```bash
npm run dev
```

Open the URL it prints (typically `http://localhost:5173`). You should see
the governance overview with stat cards, the flagged-listings queue, and
the market velocity chart, all populated from the mock API.

**If the page loads but shows an error banner**: the mock API from step 1
isn't running, or your `.env.local` URL doesn't match its port.

---

## 3. Run the mobile app (React Native + Expo)

This project uses Expo (managed workflow) — it does **not** ship `android/`
or `ios/` folders, and you don't generate them by hand for local dev. Expo
Go (a companion app on your own phone) or an emulator/simulator is all you
need to see it running.

### 3.1 Install

```bash
cd kejani-app-v2
npm install
```

### 3.2 Environment

```bash
cp .env.example .env
```
`.env.example` already points at `http://localhost:4000` (the mock API from
step 1), which works as-is for:
- **Expo Go on a physical device** — no change needed, Expo's dev server
  proxies this correctly over your LAN.
- **iOS Simulator** — works as-is.

For the **Android emulator** specifically, change it to:
```
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000
```
(`10.0.2.2` is the Android emulator's alias for your host machine —
`localhost` inside the emulator refers to the emulator itself, not your
computer.)

### 3.3 Run it

```bash
npx expo start
```

This opens Expo's dev tools in your terminal/browser. From there:
- **On your phone**: install the **Expo Go** app (App Store / Play Store),
  then scan the QR code Expo prints.
- **Android emulator**: press `a` in the terminal (needs Android Studio's
  emulator already running or configured).
- **iOS Simulator** (macOS only): press `i`.

You should land on the phone-language-and-number screen. Log in with any
number — the OTP screen accepts any 4 digits since there's no real SMS
provider wired up yet (see "What's stubbed" below).

### 3.4 Fonts

Handled automatically via `@expo-google-fonts/*` packages (installed as
part of `npm install` above) — no manual font linking step, unlike bare RN.
If they haven't finished downloading on first launch you'll briefly see a
blank screen before the splash/app appears; that's normal.

### 3.5 If you need a standalone build later (not required for local dev)

```bash
npx expo prebuild   # generates android/ and ios/ folders from app.json
npx expo run:android
# or, for a signed release build:
eas build --platform android
```
`eas build` needs an Expo account and `eas.json` — out of scope for this
guide, but flagging it so you know the path exists when you're ready to
ship rather than just run locally.

---

## What's stubbed, so nothing here surprises you later

- **OTP is fake.** Any 4-digit code passes. Real SMS delivery needs a
  provider (Africa's Talking is the common Kenyan choice) wired into the
  real backend.
- **M-Pesa STK push doesn't actually charge anyone.** The mock API just
  returns `{ requestSent: true }` immediately.
- **Chat's WebSocket has nothing to connect to.** The mock API is plain
  REST; it doesn't run a STOMP broker. The chat screen will show
  "disconnected" (grey status dot) until the real Spring Boot backend's
  WebSocket endpoint exists.
- **Photo upload is a placeholder.** "Add photo" on the listing form pushes
  a fake string, not a real image — no storage backend is wired up yet.

None of these block you from seeing and clicking through every screen —
they block the parts that need a real backend, which is the next piece of
work, not a setup problem.

---

## Quick troubleshooting

| Symptom | Likely cause |
|---|---|
| Web app shows "Could not reach the moderation API" | mock API isn't running, or `.env.local` port is wrong |
| RN app crashes on boot with "EXPO_PUBLIC_API_BASE_URL is not set" | forgot step 3.2, or Metro needs a restart after editing `.env` (`npx expo start -c` to clear the cache) |
| Android emulator can't reach the mock API | use `10.0.2.2`, not `localhost`, in `.env` |
| "Unable to resolve module ../something" | a relative import path is wrong somewhere — this exact class of bug has bitten this project before (see the changelog note below); if you hit a new one, it's worth flagging back rather than hand-patching, since there may be a sibling bug nearby |
| Expo Go shows a blank white screen briefly on first launch | normal — it's downloading the Google Fonts packages; give it a few seconds |
| `npx expo start` can't find a device | make sure Expo Go is installed and on the same WiFi network as your computer, or that an emulator/simulator is already running |

## Changelog (so repeated fixes don't look like they came out of nowhere)

- Fixed two broken relative import paths in `ProfileScreenContainer.tsx`
  (wrong depth to `state/useAuthStore`, and a duplicated path segment to
  `ProfileScreen`) — caught via a real build log, then verified against
  every other relative import in both projects programmatically.
- Switched the mobile app from bare React Native tooling to Expo: swapped
  `react-native-config` → `EXPO_PUBLIC_*` env vars, and
  `@react-native-community/geolocation` → `expo-location`. Fonts now load
  via `@expo-google-fonts/*` packages instead of local `.ttf` files +
  native asset linking (the local-file approach would have broken the
  build the same way the import bug did, since those font files were
  never actually shipped in this project).
