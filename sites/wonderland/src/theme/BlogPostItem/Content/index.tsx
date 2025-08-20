import React from "react";
import MDXContent from "@theme/MDXContent";

export default function BlogPostItemContent({ children }: any) {
  return (
    <div className="wl-post-content">
      <MDXContent className="markdown">{children}</MDXContent>
    </div>
  );
}


