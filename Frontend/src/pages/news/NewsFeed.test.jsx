// src/pages/news/NewsFeed.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NewsFeed from "./NewsFeed";
import * as newsService from "../../components/service/newsService";

// Mock the service module
jest.mock("../../components/service/newsService");

describe("NewsFeed component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("shows skeleton loaders initially", () => {
    // Make fetchCyberAttackNews return a promise that never resolves
    newsService.fetchCyberAttackNews.mockReturnValue(new Promise(() => {}));
    render(<NewsFeed />);

    // Expect 6 placeholders
    const skeletons = screen.getAllByText("", { selector: ".skeleton-img" });
    expect(skeletons).toHaveLength(6);
  });

  test("shows error message if fetch fails", async () => {
    newsService.fetchCyberAttackNews.mockRejectedValue(new Error("Network error"));
    render(<NewsFeed />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Error loading news: Network error");
    });
  });

  test("renders articles on successful fetch", async () => {
    const fakeArticles = [
      {
        source: { name: "Test Source" },
        title: "Test Title",
        description: "Test Description",
        url: "https://example.com",
        urlToImage: "https://example.com/image.jpg",
        publishedAt: "2025-04-01T10:00:00Z",
      },
    ];
    newsService.fetchCyberAttackNews.mockResolvedValue({ data: { articles: fakeArticles } });

    render(<NewsFeed />);

    // Wait for title to appear
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Title");
    });

    // Link should have correct href
    const link = screen.getByRole("link", { name: "Test Title" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
