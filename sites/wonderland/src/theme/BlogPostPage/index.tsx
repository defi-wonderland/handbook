import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function BlogPostPage(props: any) {
  const Content = props?.content as React.ComponentType<any> & { metadata?: any };
  const meta = Content?.metadata || props?.metadata || {};
  const authors = meta?.authors || [];

  const withOrdinal = (d: Date): string => {
    const day = d.getDate();
    const j = day % 10;
    const k = day % 100;
    const suffix = j === 1 && k !== 11 ? "st" : j === 2 && k !== 12 ? "nd" : j === 3 && k !== 13 ? "rd" : "th";
    const month = d.toLocaleString(undefined, { month: "long" });
    const year = d.getFullYear();
    return `${month} ${day}${suffix}, ${year}`;
  };
  const dateStr = meta?.date ? withOrdinal(new Date(meta.date)) : undefined;

  return (
    <Layout title={meta?.title} description={meta?.description}>
      <main className="wl-post-page">
        <div className="wl-post-header">
          <h1 className="wl-post-title">{meta?.title}</h1>
          {(authors.length > 0 || dateStr) && (
            <div className="wl-post-meta">
              <div className="wl-post-author-line">
                {authors.length > 0 && (
                  <div className="wl-post-authors-line">
                    {authors.map((a: any, idx: number) => (
                      <span key={idx} className="wl-post-author">
                        {a?.imageURL && (
                          <img
                            className="wl-post-author-avatar wl-post-author-avatar--sm"
                            src={a.imageURL}
                            alt={a?.name || ""}
                            loading="lazy"
                          />
                        )}
                        {a?.name && <span className="wl-post-author-name">{a.name}</span>}
                        {idx < authors.length - 1 && (
                          <span className="wl-post-author-sep">,</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                {dateStr && (
                  <>
                    <span className="wl-post-bullet" aria-hidden>
                      •
                    </span>
                    <span className="wl-post-date">{dateStr}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="wl-post-content">
          {Content ? <Content /> : null}
        </div>

        {/* Share + Recommendations */}
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

          {/* Related posts section removed */}
        </section>
      </main>
    </Layout>
  );
}


