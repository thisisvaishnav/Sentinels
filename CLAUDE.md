# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                 # install app deps
npm start                   # expo start (Metro)
npm run android             # expo start --offline --localhost --android
npm run ios                 # expo start --ios
npm run lint                # expo lint (eslint-config-expo, flat config)
npm run server              # TypeScript API on :5001 via sucrase-node src/server/index.ts

npx tsc --noEmit            # typecheck (no script defined; strict mode is on)
npx expo start -c           # clear Metro cache — needed after any .env change

cd ApiTesting && npm install && npm start   # the *other* API, also :5001 (node src/server.js)
cd ApiTesting && npm run dev                # same, with nodemon
```

There is no test runner in the root project and **zero test files exist anywhere**. `ApiTesting/` has jest + supertest configured (`npm test` → `jest --runInBand --detectOpenHandles`) but no specs yet; a new test there is the first one. `scripts/testHouseholdApi.ts` is a hand-rolled integration script (boots `src/server` on :5004 and hits it over HTTP), not a jest suite.

## Naming

The same app is called three different things depending on where you look: **Sentinels** (`app.json`, package name), **DRISHTI** (`AGENTS.md`, `constants/adminTheme.ts`), and **Lokvision** (`src/features/enumeration/*`, storage keys). Match whichever name the surrounding module already uses rather than normalizing.

## Architecture

React Native + Expo (SDK 54, React 19, RN 0.81), expo-router file-based routing, TypeScript strict. Supabase/PostgreSQL for data. **Mobile-only by policy** — the README forbids compromising native iOS/Android layouts for web, even though `react-native-web` is installed.

`@/*` in tsconfig maps to the **repo root**, so imports read `@/src/lib/supabase`, `@/constants/colors`, `@/hooks/use-color-scheme`.

`app.json` enables two experiments: `typedRoutes` and `reactCompiler`. The React Compiler means manual memoization is usually unnecessary — its absence in existing code is deliberate, not an oversight.

### Routing

Four route groups under `app/`, each with its own `_layout.tsx` Stack and `headerShown: false`: `(auth)`, `(citizen)`, `(enumerator)`, `(admin)`. `app/_layout.tsx` is the gate — it reads `hasOnboarded` from AsyncStorage and redirects to `/onboarding` unless the user is already in `onboarding` or `(auth)`. Only `(admin)` wraps its Stack in a provider (`AdminDrawerProvider`).

Navigation is expo-router only. Do not add React Navigation navigators — the `@react-navigation/*` packages are present as expo-router's transitive deps, not as an API to build against.

### Three coexisting auth mechanisms

This is the single most confusing part of the codebase. `src/features/auth/authService.ts` fans out by role:

1. **Citizen** → custom Express API. `POST /api/auth/citizen/{signup,login}` on the Node server, which does its own bcrypt hashing and signs its own JWT with `JWT_SECRET`. The token lands in SecureStore under `citizen_token` (+ `citizen_user`). Supabase Auth is not involved.
2. **Admin / Enumerator** → Supabase Auth (`signInWithPassword`) with **synthetic emails** derived from an ID so the same identifier can exist across roles: `<employeeId>@admin.sentinels.app`, `<enumeratorId>@enumerator.sentinels.app`. Enumerator login then fetches the `enumerator_profiles` row keyed on the JWT's `user_id`.
3. **A hardcoded dev backdoor** — `ENUM001` / `123456` returns a fake profile without touching the network. It is duplicated in two functions (`loginEnumerator` and `loginWithRole`); remove both together.

`signOut()` must clear *both* worlds: delete the SecureStore citizen keys **and** call `supabase.auth.signOut()`.

`src/lib/supabase.ts` wraps SecureStore in a **chunking adapter** — SecureStore caps values at 2048 bytes and Supabase sessions exceed that, so values are split into 1800-byte chunks tracked by a `<key>_chunkCount` entry. Don't swap in plain SecureStore or AsyncStorage here.

### Two Express backends, both on port 5001

They overlap and **cannot run at the same time**:

| | `src/server/` | `ApiTesting/` |
|---|---|---|
| Language | TypeScript, ESM-style, run via sucrase | JavaScript, CommonJS |
| Deps | root `package.json` | its own `package.json` (Express 4, `pg`) |
| Run | `npm run server` | `cd ApiTesting && npm start` |
| Routes | `/api/auth` citizen signup+login+household-status, `/api/household` (GET/POST), `/api/citizen` schemes / applications / support / dashboard-summary / profile | `/api/auth` citizen signup+login **and** enumerator login, `/api/enumerator/tasks` (CRUD + `/:id/visit`), `/api/citizen/household` |
| Auth middleware | `authenticateCitizen` — hard-requires `role === 'citizen'` | `requireAuth` + `requireRole(...roles)` |

`ApiTesting/` is the newer, more complete one (it has enumerator auth and tasks; it also throws at import time if `JWT_SECRET` is missing, whereas `src/server` uses a fallback secret). Confirm which server the task targets before adding an endpoint — and if you add one to both, keep the response envelopes distinct: `src/server` returns `{ error, details }`, `ApiTesting` returns `{ success, message }`.

Both servers talk to Supabase with the **service role key**, deliberately bypassing RLS. `HowAuth.md` is the canonical walkthrough for adding a new auth endpoint (Zod schema → uniqueness check → bcrypt → insert → JWT), including two environment gotchas worth knowing: port 5000 is taken by macOS AirPlay Receiver, and Android emulators must reach the host as `10.0.2.2`, not `localhost`.

### Feature modules

`src/features/enumeration/` is the mature pattern and the model for new work:

```
src/features/enumeration/
├── components/<screen-name>/   # one folder per route, small single-purpose cards
├── data/                       # persistence + derivation layer
├── types/ , types.ts           # shared shapes
└── theme.ts                    # module design tokens
```

The `data/` layer is the important seam. Households persist to AsyncStorage under `@lokvision_enumerator_households`, and the *adapters* (`blindSpotAdapter.ts`, `gisAdapter.ts`) **derive** their screens' view models from those records deterministically rather than storing them — e.g. `getDerivedBlindSpots()` groups households by locality, computes coverage/severity, and synthesizes filler areas when the dataset is small. This is intentional: it keeps screens working offline today and leaves one file per view to swap when a real backend arrives. Add new derived views as adapters here; don't compute them inline in screens.

Screens under `app/(enumerator)/` stay thin — they compose `components/<screen-name>/*` and call `data/*`.

`src/components/admin/` is the parallel structure for admin (flat, plus `citizen-reports/` and `survey/` subfolders). Admin screens still read from `src/data/*MockData.ts`.

Empty `.gitkeep`-only directories (`src/features/{admin,forms,household}`, `src/hooks`, `src/utils`, `src/services`) are placeholders — check whether an existing module already owns the concern before filling one in.

### Design tokens — four palettes, three of them overlapping

| File | Exports | Used by |
|---|---|---|
| `constants/colors.ts` | `AppColors`, `AppRadius` | `(auth)`, `RoleSelectionScreen` |
| `src/features/enumeration/theme.ts` | `ENUMERATOR_THEME` | `(enumerator)` |
| `constants/adminTheme.ts` | `COLORS` (navy `#07145C`) | `(admin)` |
| `constants/theme.ts` | `Colors` light/dark, `Fonts` | Expo template leftover; `hooks/use-theme-color.ts` |

`constants/colors.ts` and `src/features/enumeration/theme.ts` hold **the same hex values under different key names** — same palette, two vocabularies. Use whichever one the module you are editing already imports; do not introduce a fifth palette, and do not "unify" them as a side effect of another task.

The `(citizen)` screens use no tokens at all — every colour is an inline hex, with three different "primary" darks (`#0F172A`, `#1E293B`, `#172A3A`) coexisting, and `borderRadius: 0` throughout as a deliberate square look.

## Known debt

`docs/audits/auditfile.md` is a detailed audit of the citizen/auth flow — read it before touching those screens. It is mostly accurate but stale in one place: it cites `edgeToEdgeEnabled` in `app.json`, which is no longer there. Verified as still true:

- **`marginTop: -30` on the root SafeAreaView of 10 files** (all of `(citizen)`, both `(auth)` screens, `(admin)/login`, `RoleSelectionScreen`, `AdminLayout`) — brute-force cancellation of the safe-area top inset. Don't copy it into new screens.
- **Zero `FlatList`/`SectionList` anywhere** — every list is `.map()` inside a `ScrollView`. Fine at mock-data scale; reach for `FlatList` when a list becomes backend-driven.
- **No accessibility props** (`accessibilityRole`, `accessibilityLabel`, `testID`) in the citizen/auth flow, and no `RefreshControl`.
- **Orphaned code**: root `App.tsx` (~28KB, zero importers — the entry is `index.js` → `expo-router/entry`), `src/services/citizenService.ts` (fully written, never imported — citizen screens `fetch` inline instead), `src/features/auth/citizenNavigation.ts` (`routeCitizenAfterAuth()` unused; screens hardcode `router.replace('/(citizen)/dashboard')`).
- **Installed but never imported**: `expo-haptics`, `expo-symbols`, `react-native-gesture-handler` (no `GestureHandlerRootView` mounted), `react-native-reanimated` (side-effect import only), `@tanstack/react-query`, `react-hook-form`. Per `AGENTS.md`, prefer these existing deps over new ones — but wiring one up for the first time means adding its provider/root component too.

## Working conventions

From `AGENTS.md`, and worth following:

- TypeScript only; reuse existing components before creating new ones; keep diffs scoped to the task and don't touch unrelated files.
- Before implementing, state what exists, what changes, which files are created/modified/removed, and the risks.
- Don't redesign existing screens or introduce a new palette unless asked.
- Finish the wiring — creating a component without integrating it into its route counts as incomplete.
- After changing anything, check for TypeScript errors (`npx tsc --noEmit`), broken imports, and unused files.

Never commit `.env` or `opencode.json` (both gitignored; `opencode.json` carries a live API key). `task.md` at the repo root is a scratch note holding a known-good `household_profiles` INSERT, not a task list.
