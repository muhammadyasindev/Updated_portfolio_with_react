import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const metadata = {
  title: {
    default: "Portfolio — Full-Stack Developer",
    template: "%s | Portfolio",
  },
  description:
    "Full-stack developer building modern, fast and reliable web applications — React, Next.js, Node.js and PostgreSQL.",
  keywords: ["Full-Stack Developer", "React", "Next.js", "Node.js", "Web Developer"],
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#05060f",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export default async function RootLayout({ children }) {
  const profile = await getSettings().catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#e11d48] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Nav profile={profile} />
        <main id="main">{children}</main>
        <Footer profile={profile} />
      </body>
    </html>
  );
}
