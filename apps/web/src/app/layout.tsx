import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono, Poppins, Nunito, Lexend, Atkinson_Hyperlegible, Merriweather } from "next/font/google";
import "./globals.css";

// Each option gets its own CSS variable (never --font-sans directly) so all
// six can be loaded simultaneously without fighting over which one "wins" --
// the active choice is picked at runtime via the [data-font] rule in
// globals.css, driven by the user's saved preference (see useFontPreference).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });
const atkinson = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--font-atkinson", weight: ["400", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-merriweather", weight: ["400", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "Bosket's EduSheet - AI CBSE Worksheet Generator",
  description: "AI-powered CBSE worksheet platform by Bosket's Tech Ventures. Generate curriculum-aligned worksheets for Classes 1-10 in seconds.",
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
      <body className={`${inter.variable} ${poppins.variable} ${nunito.variable} ${lexend.variable} ${atkinson.variable} ${merriweather.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
