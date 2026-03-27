"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the DriverHistoryPage component
const DriverHistoryPage = dynamic(
  () => import("../../../../../../modules/ceo/pages/Drivers/components/DriverHistoryPage"),
  { ssr: false, loading: () => <div>Loading driver history...</div> }
);

export default function DriverHistoryPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  // Add state to control client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Use effect to set isClient to true after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Only render the component when we're on the client
  if (!isClient) {
    return <div>Loading driver history...</div>;
  }
  
  return <DriverHistoryPage id={id} />;
} 