import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <header>Admin Panel</header>
      <main>{children}</main>
    </div>
  );
}
