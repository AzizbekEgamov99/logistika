import React from "react";

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="accounting-layout">
            <header>Accounting Panel</header>
            <main>{children}</main>
        </div>
    );
}