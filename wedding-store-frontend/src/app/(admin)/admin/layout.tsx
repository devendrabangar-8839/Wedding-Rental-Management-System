'use client';

import { SidebarNavigation } from "@/components/dashboard/SidebarNavigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">AUTHENTICATING SESSION...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex bg-secondary/10">
      <SidebarNavigation />
      <div className="flex-1 min-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
