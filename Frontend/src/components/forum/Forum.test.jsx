// src/components/forum/Forum.test.jsx

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Forum from "./Forum.jsx";
import { AuthContext } from "../../context/AuthContext";

// Mock axios.get
jest.mock("axios", () => ({
  get: jest.fn(),
}));

// Mock useNavigate from react-router-dom, preserve other exports
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

// Mock Post and ActiveUsers to simplify rendering
jest.mock("./Post", () => ({ post }) => <div data-testid="post">{post.title}</div>);
jest.mock("../sidebar/ActiveUsers", () => () => <div data-testid="active-users" />);

describe("Forum Component", () => {
  let navigateMock;

  const postsMock = [
    { _id: "1", title: "First", likes: [1, 2], createdAt: "2025-04-22T10:00:00Z" },
    { _id: "2", title: "Second", likes: [], createdAt: "2025-04-23T10:00:00Z" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock = jest.fn();
    router.useNavigate.mockReturnValue(navigateMock);
  });

  // Test 1: renders header and description
  test("renders forum header and description", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <Forum />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole("heading", { name: /Scam Forum/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Share scams you've encountered and learn from others\./i)
    ).toBeInTheDocument();
  });

  // Test 2: shows Create Post button for authenticated user and navigates
  test("shows Create Post button for authenticated user and navigates", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <MemoryRouter>
          <Forum />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const btn = screen.getByRole("button", { name: /Create Post/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(navigateMock).toHaveBeenCalledWith("/create-post");
  });

  // Test 3: fetches and displays posts sorted by newest
  test("fetches posts and displays them sorted by newest", async () => {
    axios.get.mockResolvedValue({ data: postsMock });
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <Forum />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const items = await screen.findAllByTestId("post");
    expect(items.map(el => el.textContent)).toEqual(["Second", "First"]);
  });

  // Test 4: reorders posts when sorting by Most Liked
  test("reorders posts when sorting by Most Liked", async () => {
    axios.get.mockResolvedValue({ data: postsMock });
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <Forum />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await screen.findAllByTestId("post");

    fireEvent.change(screen.getByLabelText(/Sort by:/i), {
      target: { value: "liked" },
    });

    const likedItems = screen.getAllByTestId("post");
    expect(likedItems.map(el => el.textContent)).toEqual(["First", "Second"]);
  });
});
