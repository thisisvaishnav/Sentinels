# Sentinels — Project Information

## Overview

| Field | Value |
|---|---|
| **App Name** | Sentinels |
| **Version** | 1.0.0 |
| **Platform** | iOS · Android · Web |
| **Framework** | Expo ~54.0.36 (New Architecture enabled) |
| **Language** | TypeScript ~5.9.2 |
| **React** | 19.1.0 |
| **React Native** | 0.81.5 |
| **Router** | Expo Router ~6.0.24 (file-based routing) |
| **Orientation** | Portrait |

---

## Architecture

```
React Native
     │
     │ JSON + JWT
     ▼
Backend API
     │
     ├── /citizen/signup
     ├── /citizen/login
     ├── /enumerator/login
     ├── /admin/signup
     ├── /admin/login
     ├── /me
     └── /logout
     │
     ▼
Supabase PostgreSQL
     │
     ├── citizen_profiles
     ├── enumerator_profiles
     └── admin_profiles
```

---

## Project Structure

```
Sentinels/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout
│   ├── modal.tsx                 # Modal screen
│   ├── onboarding.tsx            # Onboarding screen
│   ├── (admin)/
│   │   └── dashboard.tsx         # Admin dashboard
│   ├── (auth)/
│   │   ├── login.tsx             # Login screen
│   │   └── register.tsx          # Registration screen
│   ├── (citizen)/
│   │   └── dashboard.tsx         # Citizen dashboard
│   ├── (enumerator)/
│   │   └── dashboard.tsx         # Enumerator dashboard
│   └── (tabs)/
│       ├── _layout.tsx           # Tab navigator layout
│       ├── index.tsx             # Home tab
│       └── explore.tsx           # Explore tab
│
├── src/                          # Application source code
│   ├── components/               # Shared components (empty, reserved)
│   ├── features/                 # Feature modules (reserved)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── enumeration/
│   │   ├── forms/
│   │   └── household/
│   ├── hooks/                    # Custom hooks (reserved)
│   ├── lib/
│   │   └── supabase.ts           # Supabase client setup
│   ├── screens/
│   │   └── RoleSelectionScreen.tsx
│   ├── services/                 # API / data services (reserved)
│   ├── types/                    # TypeScript types (reserved)
│   └── utils/                    # Utility helpers (reserved)
│
├── components/                   # Global UI components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx   # iOS-specific icon symbols
│
├── constants/
│   └── theme.ts                  # App theme / design tokens
│
├── hooks/                        # Root-level hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts   # Web-specific override
│   └── use-theme-color.ts
│
├── assets/
│   └── images/
│       ├── icon.png
│       ├── splash-icon.png
│       ├── favicon.png
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       └── react-logo@3x.png
│
├── scripts/
│   └── reset-project.js          # Project reset utility
│
├── app.json                      # Expo app configuration
├── package.json
├── tsconfig.json
├── eslint.config.js
├── expo-env.d.ts
└── AGENTS.md
```

---

## Role-Based Route Groups

| Route Group | Purpose |
|---|---|
| `(auth)` | Unauthenticated screens — Login, Register |
| `(admin)` | Admin-role dashboard |
| `(citizen)` | Citizen-role dashboard |
| `(enumerator)` | Enumerator-role dashboard |
| `(tabs)` | Shared bottom-tab navigator (Home, Explore) |

---

## Key Dependencies

### Core
| Package | Version |
|---|---|
| `expo` | ~54.0.36 |
| `expo-router` | ~6.0.24 |
| `react` | 19.1.0 |
| `react-native` | 0.81.5 |

### Navigation
| Package | Version |
|---|---|
| `@react-navigation/native` | ^7.1.8 |
| `@react-navigation/bottom-tabs` | ^7.4.0 |
| `react-native-screens` | ~4.16.0 |
| `react-native-safe-area-context` | ~5.6.0 |

### Backend / Data
| Package | Version |
|---|---|
| `@supabase/supabase-js` | ^2.112.3 |
| `@tanstack/react-query` | ^5.101.4 |
| `expo-sqlite` | ~16.0.10 |
| `@react-native-async-storage/async-storage` | 2.2.0 |

### Forms & Validation
| Package | Version |
|---|---|
| `react-hook-form` | ^7.85.0 |
| `@hookform/resolvers` | ^5.9.1 |
| `zod` | ^4.4.3 |

### UI / Animation
| Package | Version |
|---|---|
| `@expo/vector-icons` | ^15.0.3 |
| `expo-image` | ~3.0.11 |
| `expo-haptics` | ~15.0.8 |
| `react-native-gesture-handler` | ~2.28.0 |
| `react-native-reanimated` | ~4.1.1 |

---

## Expo Configuration Highlights

- **New Architecture** — enabled (`newArchEnabled: true`)
- **React Compiler** — enabled (`experiments.reactCompiler: true`)
- **Typed Routes** — enabled (`experiments.typedRoutes: true`)
- **Deep Link Scheme** — `sentinels://`
- **Web Output** — `static`
- **Android** — Edge-to-edge UI enabled; predictive back gesture disabled
- **Splash Screen** — white background (light) / black background (dark), 200 px wide, contain resize
