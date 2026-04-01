
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'Astro - Messaging',
  description: 'messaging platform with chat, stories, missions, and more.',
  generator: 'pablo',
  icons: {
    icon: [
    {
      url: '/icon-light-32x32.png',
      media: '(prefers-color-scheme: light)'
    },
    {
      url: '/icon-dark-32x32.png',
      media: '(prefers-color-scheme: dark)'
    },
    {
      url: '/icon.svg',
      type: 'image/svg+xml'
    }],

    apple: '/apple-icon.png'
  }
};

import { ContextMenuBlocker } from '@/components/ContextMenuBlocker';
import { BanScreen } from '@/components/app/moderation/BanScreen';
import { ZoomHandler } from '@/components/ZoomHandler';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export default function RootLayout({
  children


}) {
  return (
    _jsx("html", { lang: "en", children:
      _jsxs("body", { className: "font-sans antialiased", children: [
        _jsx(ContextMenuBlocker, {}),
        _jsx(BanScreen, {}),
        _jsx(ZoomHandler, {}),
        children,
        _jsx(Analytics, {})] }
      ) }
    ));

}