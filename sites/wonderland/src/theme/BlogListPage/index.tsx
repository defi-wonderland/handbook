import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import BlogCard from "../../components/BlogCard";
import { StarsBackground } from "@handbook/common-config/components";
import { useScrollReset } from "@site/src/hooks/useScrollReset";

function Hero() {
  const hero = useBaseUrl("/img/hero-blog.svg");
  const rabbit = useBaseUrl("/img/rabbit.png");
  const gradient = useBaseUrl("/img/gradient-bg.svg");
  const star = useBaseUrl("/common/img/star-icon.svg");
  return (
    <header className="wl-blog-hero">
      <div className="container wl-blog-hero__container">
        <img className="wl-blog-hero__image" src={hero} alt="Wonderland blog hero" />
        <img className="wl-blog-hero__rabbit" src={rabbit} alt="Rabbit" />
        <img className="wl-blog-hero__star" src={star} alt="" aria-hidden />
      </div>
      <img className="wl-blog-hero__gradient" src={gradient} alt="" aria-hidden />
    </header>
  );
}

const Card = ({ post }: { post: any }) => <BlogCard post={post} />;

export default function BlogListPage(props: any) {
  const posts = (props?.items || []).map((i: any) => i.content);
  const [first, second, third, fourth, ...rest] = posts;
  const { siteConfig } = useDocusaurusContext();
  const resetScrollToTop = useScrollReset(['/blog']);

  useEffect(() => {
    resetScrollToTop();
  }, [resetScrollToTop]);

  return (
    <Layout title="Blog" description={siteConfig.tagline}>
      <Hero />
      <main className="wl-blog-list">
        <StarsBackground zIndex={-1} />
        <div className="container">
          {first && (
            <section className="wl-highlights">
              <div className="wl-highlights__primary">
                <BlogCard post={first} className="wl-post-card--primary" />
              </div>
              <div className="wl-highlights__side">
                {second && <BlogCard post={second} className="wl-post-card--compact" />}
                {fourth && <BlogCard post={fourth} className="wl-post-card--compact" />}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <div className="wl-posts-grid">
              {rest.map((post) => (
                <Card key={post.metadata.permalink} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

