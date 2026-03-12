import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
