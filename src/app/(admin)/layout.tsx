import { Inter } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";
import AdminAuthWrapper from "@/auth/AdminAuthWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <ReduxProvider>
        <AdminAuthWrapper>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AdminAuthWrapper>
      </ReduxProvider>
    </div>
  );
} 