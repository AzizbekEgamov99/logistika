import { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - RBL LOGISTICS",
  description: "Admin panel dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
} 