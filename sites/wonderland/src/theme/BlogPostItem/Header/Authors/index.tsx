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
  const formatted = date ? withOrdinal(new Date(date)) : undefined;
  if ((!authors || authors.length === 0) && !date) return null;

  const shown = (authors || []).slice(0, 2);
  const remaining = Math.max((authors?.length ?? 0) - shown.length, 0);
  const aria = shown.length
    ? `Authors: ${shown.map((a) => a.name || "").filter(Boolean).join(', ')}${remaining ? `, and ${remaining} more` : ''}`
    : undefined;

  return (
    <div className="wl-post-meta" aria-label={aria}>
      {/* Avatars */}
      {authors && authors.length > 0 && (
        <div className="wl-post-authors-avatars">
          {shown.map((a, idx) => (
            a?.imageURL ? (
              <img
                key={`${a.key || a.name || idx}-avatar`}
                className="wl-post-author-avatar"
                src={a.imageURL}
                alt=""
              />
            ) : null
          ))}
        </div>
      )}

      {/* Names and date */}
      <div className="wl-post-author-line">
        {shown && shown.length > 0 && (
          <div className="wl-post-authors-line">
            {shown.map((a, idx) => (
              <span key={`${a.key || a.name || idx}-name`} className="wl-post-author">
                {a?.page && a?.key ? (
                  <Link to={`/blog/authors/${a.key}`} className="wl-post-author-name wl-post-author-name--link">
                    {a?.name || ""}
                  </Link>
                ) : (
                  <span className="wl-post-author-name">{a?.name || ""}</span>
                )}
                {idx < shown.length - 1 && <span className="wl-post-author-sep">,</span>}
              </span>
            ))}
            {remaining > 0 && (
              <span className="wl-post-author wl-post-author-name" aria-hidden>{`+${remaining}`}</span>
            )}
          </div>
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


