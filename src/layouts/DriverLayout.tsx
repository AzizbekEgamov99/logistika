import React from "react";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="driver-layout">
            <header>Driver Dashboard</header>
            <main>{children}</main>
        </div>
    );
}
