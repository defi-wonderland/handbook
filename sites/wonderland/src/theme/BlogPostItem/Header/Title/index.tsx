import React from "react";

export default function BlogPostItemHeaderTitle({ title }: { title?: string }): JSX.Element | null {
  if (!title) return null;
  return <h1 className="wl-post-title">{title}</h1>;
}


