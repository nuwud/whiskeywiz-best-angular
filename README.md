# Whiskey Wiz - Best Angular Version

This repository contains the best Angular version of the Whiskey Wiz application, a quarterly interactive whiskey tasting experience built with Angular and Firebase.

## Project Information

- **Angular Version:** 17.2.0+
- **Branch Source:** This code was extracted from the `fix/admin-routing` branch of the original repository
- **Last Updated:** January 2025

## Overview

Whiskey Wiz is a gamified whiskey tasting application that integrates with Shopify pages via web components. Players guess attributes of quarterly whiskey samples, earning points and sharing their results.

## Project Structure

This project uses Nx for monorepo management and Angular 17.2 with Firebase backend.

```
src/
├── app/
│   ├── admin/             # Admin feature module (lazy loaded)
│   ├── player/            # Player feature module (lazy loaded)
│   ├── admin-nav/         # Admin navigation module
│   ├── auth/              # Authentication components
│   ├── core/              # Core module (services)
│   ├── shared/            # Shared components and models
│   │   ├── components/
│   │   ├── game/         # Main game components
│   │   ├── models/       # Interfaces and types
│   │   └── results/      # Score display components
│   └── quarters/         # Quarter-specific components
├── assets/
│   ├── fonts/           # Hermona font files
│   └── images/          # UI assets
└── environments/        # Environment configurations
```

## Key Features

- Quarterly whiskey tasting games
- Web component integration for Shopify
- Firebase backend with real-time updates
- Guest and authenticated play modes
- Admin interface for quarter management
- Advanced analytics tracking

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Serve the application:
```bash
nx serve whiskeywiz
```

3. Build web components:
```bash
npm run build:elements
```

## Deployment

The application is deployed to Firebase Hosting.

```bash
npm run deploy
```

## Shopify Integration

Embed game components in Shopify pages using:
```html
<whiskey-wiz-{quarterId}></whiskey-wiz-{quarterId}>
```

## Environment Setup

Requires environment.ts with Firebase configuration:
```typescript
export const environment = {
  production: false,
  firebase: {
    // Firebase config
  }
};
```

## License

Proprietary - Blind Barrels © 2024