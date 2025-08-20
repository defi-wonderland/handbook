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
      key?: string;
      page?: boolean | { permalink?: string };
    }>;
  };
};

export function BlogCard({ post, className }: { post: BlogContent; className?: string }) {
  const { metadata } = post;
  const cover = metadata.frontMatter?.image;
  const authors = metadata.authors || [];
  // Limit inline rendering to 2 authors to avoid awkward wrapping on tight cards
  const visibleAuthors = authors.slice(0, 2);
  const remainingAuthorsCount = Math.max(authors.length - visibleAuthors.length, 0);

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
            {visibleAuthors.map((a, idx) => (
              <div key={idx} className="wl-author">
                {a.imageURL && (
                  <img className="wl-avatar" src={a.imageURL} alt={a.name || ""} loading="lazy" />
                )}
                <div className="wl-author__text">
                  {a.name && (
                    <div className="wl-author__name">
                      {a.page && a.key ? (
                        <Link 
                          to={`/blog/authors/${a.key}`} 
                          className="wl-author__name-link"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        a.name
                      )}
                    </div>
                  )}
                  {a.title && <div className="wl-author__title">{a.title}</div>}
                </div>
              </div>
            ))}
            {remainingAuthorsCount > 0 && (
              <div className="wl-author wl-author__extra">+{remainingAuthorsCount}</div>
            )}
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


