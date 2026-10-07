import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Databricks App",
  description: "Query Databricks SQL from Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
