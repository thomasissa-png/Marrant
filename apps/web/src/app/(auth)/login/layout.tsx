import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connecte-toi à deviens-marrant.fr pour progresser en humour.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
