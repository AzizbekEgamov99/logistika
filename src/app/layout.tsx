import type { Metadata } from "next";
import { Inter, Space_Grotesk, Roboto_Mono } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import ClientAuthWrapper from "@/auth/ClientAuthWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RBL LOGISTCS",
  description: "RBL LOGISTCS admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${robotoMono.variable}`}>
        <ReduxProvider>
          <ClientAuthWrapper>
            {children}
          </ClientAuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}