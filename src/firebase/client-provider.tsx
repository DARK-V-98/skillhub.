
"use client";

import { useUser } from "./auth/use-user";
import { FirebaseProvider } from "./provider";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
        {children}
    </FirebaseProvider>
  );
}
