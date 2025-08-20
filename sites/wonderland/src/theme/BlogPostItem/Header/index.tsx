import React from "react";
import Title from "./Title";
import Authors from "./Authors";

export default function BlogPostItemHeader(props: any) {
  const isBlogPostPage = Boolean(props?.isBlogPostPage);
  // Be defensive: metadata may be undefined depending on render context
  const meta = props?.metadata || props?.content?.metadata;

  if (!meta) {
    // No metadata available; render nothing to avoid runtime crash
    return null;
  }

  return (
    <header className="wl-post-header">
      <Title title={meta.title} />
      <Authors authors={meta.authors} date={meta.date} />
    </header>
  );
}


