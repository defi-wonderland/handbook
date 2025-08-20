import React from "react";

export default function BlogPostItemHeaderTitle({ title, isBlogPostPage }: { title?: string; isBlogPostPage?: boolean }): JSX.Element | null {
  if (!title) return null;
  return isBlogPostPage ? (
    <h1 className="wl-post-title">{title}</h1>
  ) : (
    <h2 className="wl-post-title">{title}</h2>
  );
}


