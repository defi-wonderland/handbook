import React, { useRef } from "react";
import BlogPostPage from "@theme-original/BlogPostPage";
import Authors from "@site/src/theme/BlogPostItem/Header/Authors";
import { useBlogScrollReset } from "@site/src/hooks/useScrollReset";

export default function BlogPostPageWrapper(props: any) {
  const Content = props?.content as React.ComponentType<any> & { metadata?: any };
  const meta = Content?.metadata || props?.metadata || {};
  const headerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useBlogScrollReset();

  return (
    <div className="wl-post-page-wrapper">
      {/* Custom Header */}
      <div className="wl-post-header" ref={headerRef}>
        {meta?.title ? <h1 className="wl-post-title" ref={titleRef}>{meta.title}</h1> : null}
        <Authors authors={meta?.authors} date={meta?.date} />
      </div>

      {/* Original BlogPostPage (keeps default markdown + code styles) */}
      <div className="wl-post-original">
        <BlogPostPage {...props} />
      </div>

      {/* Custom Share Section */}
      <section className="wl-post-extras">
        <div className="wl-share">
          {(() => {
            const currentUrl = typeof window !== "undefined" ? window.location.href : meta?.permalink ?? "";
            const shareText = `I went through the @DeFi_Wonderland's blog rabbit hole 🐇 Take a look at this post 👉${meta?.title ?? ""}\n${currentUrl}`;
            const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            return (
              <a
                className="wl-share-button"
                href={intent}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share this article"
              >
                <img src="/img/sharing-button.svg" alt="" aria-hidden />
              </a>
            );
          })()}
        </div>
      </section>
    </div>
  );
}

