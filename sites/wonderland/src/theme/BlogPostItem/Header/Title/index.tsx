import React from "react";

export default function BlogPostItemHeaderTitle({
  title,
  isBlogPostPage,
}: {
  title?: string;
  isBlogPostPage?: boolean;
}): JSX.Element | null {
  if (!title) return null;
  const Heading = (isBlogPostPage ? "h1" : "h2") as const;
  return <Heading className="wl-post-title">{title}</Heading>;
}


