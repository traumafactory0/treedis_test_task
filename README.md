# Matterport Integration with Next.js (App Router)

This project demonstrates how to integrate the Matterport Showcase SDK into a Next.js application using the App Router and TypeScript. The setup is focused on clarity, reusability, and simplicity.

## Getting Started

```bash
npm install
npm run dev
```

## Features

- Next.js (App Router)
- TypeScript with custom SDK typings
- Matterport integration via `MP_SDK.connect`
- Modular structure with client components

## Project Structure

```
app/
├── layout.tsx
├── page.tsx
└── _components/
    ├── map-frame.tsx
    └── three-model.tsx
types/
└── sdk.d.ts
```

## SDK Integration

### 1. Add the Matterport SDK script

Inside `layout.tsx`:

```tsx
import Script from 'next/script';

<Script src="https://static.matterport.com/showcase-sdk/latest.js" />
```

### 2. Create the client component

Inside `app/_components/map-frame.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ShowcaseEmbedWindow } from '@/types/sdk';

const SDK_KEY = process.env.NEXT_PUBLIC_MATTER_PORT_SDK ?? '';

export const MapFrame = () => {
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [sdkWindow, setSdkWindow] = useState<ShowcaseEmbedWindow>();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSdkWindow(window as ShowcaseEmbedWindow);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (!mapRef.current || !sdkWindow?.MP_SDK) return;

      try {
        await sdkWindow.MP_SDK.connect(mapRef.current, SDK_KEY, '');
      } catch (err) {
        console.error(err);
        setHasError(true);
      }
    };

    connect();
  }, [sdkWindow]);

  if (hasError) return <>Something went wrong...</>;

  return (
    <iframe
      ref={mapRef}
      src={`https://my.matterport.com/show?m=m72PGKzeknR&play=1&applicationKey=${SDK_KEY}`}
      allow="fullscreen; vr"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```

## Environment Variables

Create a `.env` file in the root with your SDK key:

```
NEXT_PUBLIC_MATTER_PORT_SDK=your_matterport_key_here
```

## References

- [Matterport SDK](https://matterport.github.io/showcase-sdk/)
- [Next.js Documentation](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)