import React from "react";

const withOrdinal = (d: Date): string => {
  const day = d.getDate();
  const j = day % 10;
  const k = day % 100;
  const suffix = j === 1 && k !== 11 ? "st" : j === 2 && k !== 12 ? "nd" : j === 3 && k !== 13 ? "rd" : "th";
  const month = d.toLocaleString(undefined, { month: "long" });
  const year = d.getFullYear();
  return `${month} ${day}${suffix}, ${year}`;
};

type Author = { name?: string; title?: string; imageURL?: string };

export default function BlogPostItemHeaderAuthors({
  authors = [],
  date,
}: {
  authors?: Author[];
  date?: string;
}): JSX.Element | null {
  const mainAuthor = authors[0];
  const formatted = date ? withOrdinal(new Date(date)) : undefined;
  if (!mainAuthor && !date) return null;

  return (
    <div className="wl-post-meta">
      {mainAuthor?.imageURL && (
        <img className="wl-post-author-avatar" src={mainAuthor.imageURL} alt={mainAuthor.name || ""} />
      )}
      <div className="wl-post-author-line">
        {mainAuthor?.name && <span className="wl-post-author-name">{mainAuthor.name}</span>}
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


