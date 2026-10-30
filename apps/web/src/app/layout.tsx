import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Each option gets its own CSS variable (never --font-sans directly) so all
// six can be loaded simultaneously without fighting over which one "wins" --
// the active choice is picked at runtime via the [data-font] rule in
// globals.css, driven by the user's saved preference (see useFontPreference).
//
// "Recess" visual identity (chosen 2026-08): Fredoka (chunky, rounded,
// confident) for display headings, DM Sans for body -- replaces the earlier
// Inter/Fraunces pairing. DM Sans is now the --font-sans DEFAULT but the
// font-picker mechanism below is untouched -- a user can still switch to any
// of the other five options.
//
// Self-hosted (../fonts/*.woff2, latin subset) rather than next/font/google:
// Vercel's build fetches all 8 of these from Google Fonts at build time, and
// any single one failing (a flaky Google Fonts API response) fails the whole
// build -- it happened repeatedly on 2026-10-30. Self-hosting removes that
// network dependency entirely. Files were fetched once from Google Fonts'
// own css2 API (so they're byte-identical to what next/font/google would
// have downloaded) -- see apps/web/src/fonts/CREDITS.md for the source and
// OFL licensing of each.
const dmSans = localFont({
  src: [
    { path: "../fonts/dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/dm-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/dm-sans-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/dm-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const nunito = localFont({
  src: [
    { path: "../fonts/nunito-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/nunito-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/nunito-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/nunito-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
});
const lexend = localFont({
  src: [
    { path: "../fonts/lexend-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/lexend-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/lexend-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/lexend-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lexend",
  display: "swap",
});
const atkinson = localFont({
  src: [
    { path: "../fonts/atkinson-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/atkinson-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});
const merriweather = localFont({
  src: [
    { path: "../fonts/merriweather-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/merriweather-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-merriweather",
  display: "swap",
});
const fredoka = localFont({
  src: [
    { path: "../fonts/fredoka-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/fredoka-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/fredoka-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/jetbrains-mono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bosket's EDStudio - AI Learning Platform for CBSE & ICSE",
  description: "AI-powered learning platform by Bosket's Tech Ventures -- worksheets, study material, Tech Lab, and Chem Lab for CBSE and ICSE, Classes 1-12.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before paint, so there's no flash of the
            wrong theme on load. Kept inline (not a hook) since it must run
            before React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');var f=localStorage.getItem('font');if(f)document.documentElement.setAttribute('data-font',f);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${poppins.variable} ${nunito.variable} ${lexend.variable} ${atkinson.variable} ${merriweather.variable} ${fredoka.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
