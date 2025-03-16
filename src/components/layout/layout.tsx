
import { Navigation } from "./navigation";
import { PageHeader } from "./page-header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation className="fixed bottom-0 left-0 z-50 w-full border-t bg-background p-2 md:hidden" />
      <div className="flex flex-1 flex-col md:flex-row">
        <Navigation className="hidden w-64 border-r bg-background md:block" />
        <main className="flex-1 pb-20 md:pb-6">
          <PageHeader />
          <div className="px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
