
import { Navigation } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navigation className="w-full md:w-64" />
      <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
        {children}
      </main>
    </div>
  );
}
