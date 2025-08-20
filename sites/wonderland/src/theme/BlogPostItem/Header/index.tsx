import React from "react";
import Title from "./Title";
import Authors from "./Authors";

type Meta = { title?: string; authors?: unknown; date?: string };
type Props = {
  isBlogPostPage?: boolean;
  metadata?: Meta;
  content?: { metadata?: Meta };
};

export default function BlogPostItemHeader(props: Props) {
  // Be defensive: metadata may be undefined depending on render context
  const meta = props?.metadata || props?.content?.metadata;
  const isBlogPostPage = Boolean(props?.isBlogPostPage);

  if (!meta) {
    // No metadata available; render nothing to avoid runtime crash
    return null;
  }

  return (
    <header className="wl-post-header">
      <Title title={meta.title} isBlogPostPage={isBlogPostPage} />
      <Authors authors={meta.authors} date={meta.date} />
    </header>
  );
}


