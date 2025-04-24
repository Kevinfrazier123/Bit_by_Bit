// src/pages/news/NewsFeed.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchCyberAttackNews } from "../../components/service/newsService";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import "./NewsFeed.css";

export default function NewsFeed() {
  // read ?q= initial filter from URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [articles, setArticles]     = useState([]);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchTerm, setSearchTerm] = useState(params.get("q") || "");

  // Fetch one page of articles
  const loadArticles = () => {
    fetchCyberAttackNews(page)
      .then(res => {
        const newArts = res.data.articles || [];
        setArticles(prev => [...prev, ...newArts]);
        setHasMore(newArts.length > 0);
        setPage(prev => prev + 1);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  // Initial load
  useEffect(() => {
    loadArticles();
  }, []);

  // Filtered list
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show skeleton on first load
  if (loading && page === 1) {
    return (
      <div className="articles-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="article-card skeleton" key={i}>
            <div className="skeleton-img" />
            <div className="skeleton-text title" />
            <div className="skeleton-text body" />
          </div>
        ))}
      </div>
    );
  }

  // Show error with alert role
  if (error) {
    return (
      <p className="nf-error" role="alert" aria-live="assertive">
        Error loading news: {error.message}
      </p>
    );
  }

  return (
    <div className="news-feed-container">
      <div className="nf-header">
        <h2 className="nf-title">Latest Cyber-Attack News</h2>
        <div className="nf-controls" role="search">
          <input
            type="text"
            placeholder="Search by title or source…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Filter articles by keyword"
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={filtered.length}
        next={loadArticles}
        hasMore={hasMore}
        loader={
          <p className="nf-loading" aria-live="polite">
            Loading more…
          </p>
        }
        scrollThreshold={0.9}
        aria-label="Cyber-attack news list"
      >
        <div className="articles-grid">
          {filtered.map((a, i) => (
            <motion.article
              className="article-card"
              key={`${a.url}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {a.urlToImage && (
                <img
                  src={a.urlToImage}
                  alt={a.title}
                  className="article-image"
                  loading="lazy"
                />
              )}
              <div className="article-content">
                <h3 className="article-heading">
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    {a.title}
                  </a>
                </h3>
                <p className="article-description">{a.description}</p>
                <div className="article-meta">
                  <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                  <span className="source-name">{a.source.name}</span>
                </div>
                <div className="share-buttons" aria-label="Share article">
                  <a
                    href={`https://twitter.com/share?url=${encodeURIComponent(a.url)}&text=${encodeURIComponent(a.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(a.url)}&title=${encodeURIComponent(a.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
