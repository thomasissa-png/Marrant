import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-yellow focus:px-4 focus:py-2 focus:text-background focus:font-semibold"
      >
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
      <ToastProvider />
    </>
  );
}
