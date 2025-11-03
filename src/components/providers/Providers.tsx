'use client'

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { SessionManager } from "@/components/auth/SessionManager";
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReduxProvider>
          <CurrencyProvider>
            <SessionManager />
            {children}
            <Toaster />
          </CurrencyProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}