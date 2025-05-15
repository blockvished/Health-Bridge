"use client";

import React, { ReactNode } from "react";
import PostsSessionProvider from "./PostsSessionProvider";

interface PostsLayoutProps {
  children: ReactNode;
}

export default function PostsLayout({ children }: PostsLayoutProps) {
  return (
    <PostsSessionProvider>
      <div className="admin-posts-container flex flex-col min-h-screen">
        {/* Any common layout elements for the /admin/posts section can go here */}
        <main className="flex-grow">{children}</main>
      </div>
    </PostsSessionProvider>
  );
}
