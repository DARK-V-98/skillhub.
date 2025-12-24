// This file is intentionally blank. It is used to provide a client-side entry point for the Firebase provider.
"use client";

import { AuthProvider } from "./auth";
import { FirebaseProvider } from "./provider";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </FirebaseProvider>
  );
}
