import { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login - RBL LOGISTICS",
  description: "Admin panel login page",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
} 