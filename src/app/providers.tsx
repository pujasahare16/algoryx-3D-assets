'use client';

import { AuthProvider } from '@/lib/hooks/useAuth';
import { ToastProvider } from '@/lib/hooks/useToast';
import { AssetsProvider } from '@/lib/hooks/useAssetsStore';
import Navbar from '@/components/ui/Navbar';
import ToastContainer from '@/components/ui/ToastContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AssetsProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
          <ToastContainer />
        </AssetsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
