import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TapLoader } from "../components/staywise/TapLoader";
import { CinematicParticles } from "../components/staywise/CinematicParticles";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StayWise — Smart stay decisions for Indian travelers" },
      { name: "description", content: "StayWise matches you to the smartest mix of hotels, hostels, homestays, dharamshalas and local stays — by budget, food, people and purpose." },
      { name: "author", content: "StayWise" },
      { property: "og:title", content: "StayWise — Smart stay decisions for Indian travelers" },
      { property: "og:description", content: "StayWise matches you to the smartest mix of hotels, hostels, homestays, dharamshalas and local stays — by budget, food, people and purpose." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "StayWise — Smart stay decisions for Indian travelers" },
      { name: "twitter:description", content: "StayWise matches you to the smartest mix of hotels, hostels, homestays, dharamshalas and local stays — by budget, food, people and purpose." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/fYKqALvA4mYuMPjLzeXiDaQmzHu1/social-images/social-1778417310630-staywisee.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/fYKqALvA4mYuMPjLzeXiDaQmzHu1/social-images/social-1778417310630-staywisee.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <CinematicParticles density={70} />
      <Outlet />
      <TapLoader />
    </>
  );
}
