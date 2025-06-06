import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import PerformanceMonitorWrapper from '@/app/components/PerformanceMonitorWrapper';

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
  title: "Star Wars Search",
  description: "Search for Star Wars movies and characters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <header className="bg-black py-4 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-2xl font-bold text-center">SWStarter</h1>
          </div>
        </header>
        <main className="flex justify-center px-4 gap-[30px] min-h-screen max-w-full overflow-x-hidden">
          {children}
        </main>
        {/* Performance Monitor - Moved outside of any containers */}
        <PerformanceMonitorWrapper />
      </body>
    </html>
  );
}
