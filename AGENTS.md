# DRISHTI — AI Coding Agent Instructions

## Project Overview

DRISHTI is a React Native application built with Expo Router.

The application has:
- Citizen flows
- Admin flows
- Enumerator flows
- Survey management
- Reports
- Authentication

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- React Native Reanimated
- React Native Gesture Handler
- Supabase
- PostgreSQL

## Project Structure

app/
├── (auth)/
├── (admin)/
└── ...

src/
├── components/
├── contexts/
├── services/
├── hooks/
├── lib/
└── ...

## Important Architecture Rules

### Navigation

Use Expo Router for navigation.

Do NOT introduce React Navigation navigators unless explicitly requested.

Existing navigation structure should be preserved.

### Components

Reusable UI components should live inside:

src/components/

Admin-specific components should live inside:

src/components/admin/

### Context

Global state shared across multiple admin screens should use React Context.

### Styling

Follow the existing DRISHTI design system.

Do not introduce a new color palette.

Do not redesign existing screens unless explicitly requested.

### Dependencies

Before installing a new dependency:

1. Check package.json.
2. Check whether an existing dependency already provides the functionality.
3. Avoid unnecessary dependencies.

Already installed:
- react-native-gesture-handler
- react-native-reanimated

### Coding Rules

- TypeScript only.
- Reuse existing components whenever possible.
- Do not duplicate components.
- Do not modify unrelated files.
- Preserve existing functionality.
- Keep changes minimal and focused.
- Follow existing naming conventions.

## Before Coding

First inspect:

1. package.json
2. app/
3. src/
4. relevant existing components
5. relevant contexts/hooks
6. existing navigation
7. database/service layer if the task involves data

Then explain:

- what currently exists
- what needs to change
- files that will be created
- files that will be modified
- files that will be removed
- potential risks

Only then implement.

## After Coding

Verify:

- TypeScript errors
- imports
- navigation
- existing functionality
- affected screens
- unused files/imports

Do not stop after creating files. Make sure the feature is actually integrated.
