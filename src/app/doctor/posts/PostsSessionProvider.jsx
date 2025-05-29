"use client";

import { SessionProvider } from "next-auth/react";

export default function PostsSessionProvider({ children }) {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}