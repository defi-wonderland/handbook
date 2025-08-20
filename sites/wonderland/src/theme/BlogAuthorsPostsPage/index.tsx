import React from 'react';
import Layout from '@theme/Layout';
import BlogCard from '../../components/BlogCard';

function BlogAuthorsPostsPageContent({author, items}: any) {
  // Transform items to posts like in BlogListPage
  const posts = (items || []).map((item: any) => item.content);
  const postCount = posts.length;
  
  // Debug: Log to help verify override is working
  console.log('Custom BlogAuthorsPostsPage rendering for author:', author?.name || 'unknown');

  return (
    <Layout>
        <div className="container margin-top--lg">
          <div className="row">
            <div className="col col--12">
              {/* Author Header */}
              <div className="wl-author-page-header">
                {(author.imageURL || author.image_url) && (
                  <img 
                    className="wl-author-page-avatar" 
                    src={author.imageURL || author.image_url} 
                    alt={author.name || ''} 
                  />
                )}
                <div className="wl-author-page-info">
                  <h1 className="wl-author-page-name">{author.name}</h1>
                  {author.title && (
                    <p className="wl-author-page-title">{author.title}</p>
                  )}
                  {author.description && (
                    <div className="wl-author-page-description">
                      {author.description.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  <div className="wl-author-page-stats">
                    <span className="wl-author-post-count">
                      {postCount} {postCount === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blog Posts */}
              {postCount > 0 && (
                <div className="wl-author-posts-section">
                  <h2>Posts by {author.name}</h2>
                  <div className="wl-post-grid">
                    {posts.map((post) => (
                      <BlogCard 
                        key={post.metadata.permalink}
                        post={post} 
                        className="wl-author-post-card"
                      />
                    ))}
                  </div>
                </div>
              )}

              {postCount === 0 && (
                <div className="wl-no-posts">
                  <p>No posts yet by {author.name}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </Layout>
  );
}

export default function BlogAuthorsPostsPage(props: any) {
  return (
    <div className="theme-blog-authors-posts-page">
      <BlogAuthorsPostsPageContent {...props} />
    </div>
  );
}