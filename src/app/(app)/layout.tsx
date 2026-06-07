import { AuthGate } from "@/components/auth/auth-gate";
import { AppShell } from "@/components/layout/app-shell";
import { AppStoreProvider } from "@/lib/app-store";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AppStoreProvider>
        <AppShell>{children}</AppShell>
      </AppStoreProvider>
    </AuthGate>
  );
}
