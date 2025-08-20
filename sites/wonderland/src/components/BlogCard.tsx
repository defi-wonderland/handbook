import React from "react";
import Link from "@docusaurus/Link";

type BlogContent = {
  metadata: {
    permalink: string;
    title: string;
    description?: string;
    date: string;
    frontMatter?: { image?: string };
    authors?: Array<{
      name?: string;
      title?: string;
      imageURL?: string;
    }>;
  };
};

export function BlogCard({ post, className }: { post: BlogContent; className?: string }) {
  const { metadata } = post;
  const cover = metadata.frontMatter?.image;
  const authors = metadata.authors || [];

  const formattedDate = new Date(metadata.date).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className={`wl-post-card ${className ?? ""}`}>
      <Link className="wl-post-card__thumb" to={metadata.permalink}>
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span className="wl-post-card__thumbOverlay" />}
      </Link>
      <div className="wl-post-card__body">
        <div className="wl-post-card__date">{formattedDate}</div>
        <h3 className="wl-post-card__title">
          <Link to={metadata.permalink}>{metadata.title}</Link>
        </h3>
        {metadata.description && (
          <p className="wl-post-card__excerpt">{metadata.description}</p>
        )}
        {authors.length > 0 && (
          <div className="wl-post-card__meta">
            {authors.map((a, idx) => (
              <div key={idx} className="wl-author">
                {a.imageURL && (
                  <img className="wl-avatar" src={a.imageURL} alt={a.name || ""} loading="lazy" />
                )}
                <div className="wl-author__text">
                  {a.name && <div className="wl-author__name">{a.name}</div>}
                  {a.title && <div className="wl-author__title">{a.title}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link
        to={metadata.permalink}
        aria-label={`Read: ${metadata.title}`}
        className="wl-post-card__overlay"
      />
    </article>
  );
}

export default BlogCard;


