# Project Setup Instructions

To fix the "Module not found" errors, please ensure you have the following dependencies installed:

## Required Dependencies

Run the following command to install the required dependencies:

```bash
npm install --save clsx tailwind-merge framer-motion @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-label class-variance-authority lucide-react
```

OR if you use yarn:

```bash
yarn add clsx tailwind-merge framer-motion @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-label class-variance-authority lucide-react
```

## Additional Components

Ensure that the following components are also implemented in your project:
- button.tsx
- input.tsx
- textarea.tsx
- tabs.tsx
- card.tsx
- select.tsx
- noise-texture.tsx
- layouts/app-layout.tsx

These components are referenced in your tools page but were not provided in the initial files.

## Path Resolution

The project uses path aliases like `@/components`. These are configured in tsconfig.json and jsconfig.json.
Make sure your Next.js setup correctly resolves these path aliases.

## Next.js Configuration

The next.config.js file is set up to enable the app directory. Make sure your Next.js version is compatible with this feature.
