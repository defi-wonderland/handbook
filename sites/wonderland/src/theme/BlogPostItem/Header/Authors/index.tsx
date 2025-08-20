import Link from "@docusaurus/Link";

const withOrdinal = (d: Date): string => {
  const day = d.getUTCDate();
  const j = day % 10;
  const k = day % 100;
  const suffix =
    j === 1 && k !== 11
      ? "st"
      : j === 2 && k !== 12
      ? "nd"
      : j === 3 && k !== 13
      ? "rd"
      : "th";
  const month = d.toLocaleString(undefined, { month: "long", timeZone: "UTC" });
  const year = d.getFullYear();
  return `${month} ${day}${suffix}, ${year}`;
};

type Author = { 
  name?: string; 
  title?: string; 
  imageURL?: string; 
  key?: string;
  page?: boolean | { permalink?: string };
};

export default function BlogPostItemHeaderAuthors({
  authors = [],
  date,
}: {
  authors?: Author[];
  date?: string;
}): React.ReactElement | null {
  const mainAuthor = authors[0];
  const formatted = date ? withOrdinal(new Date(date)) : undefined;
  if (!mainAuthor && !date) return null;

  return (
    <div className="wl-post-meta">
      {mainAuthor?.imageURL && (
        <img className="wl-post-author-avatar" src={mainAuthor.imageURL} alt={mainAuthor.name || ""} />
      )}
      <div className="wl-post-author-line">
        {mainAuthor?.name && (
          <>
            {mainAuthor.page && mainAuthor.key ? (
              <Link 
                to={`/blog/authors/${mainAuthor.key}`} 
                className="wl-post-author-name wl-post-author-name--link"
              >
                {mainAuthor.name}
              </Link>
            ) : (
              <span className="wl-post-author-name">{mainAuthor.name}</span>
            )}
          </>
        )}
        {formatted && (
          <>
            <span className="wl-post-bullet" aria-hidden>
              •
            </span>
            <span className="wl-post-date">{formatted}</span>
          </>
        )}
      </div>
    </div>
  );
}


