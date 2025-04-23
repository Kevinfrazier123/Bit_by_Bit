// src/pages/post/PostDetail.test.jsx

// Mock axios methods
jest.mock("axios", () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

// Mock react-router-dom useNavigate while preserving other exports
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostDetail from "./PostDetail.jsx";
import { AuthContext } from "../../context/AuthContext";

// fake post returned by axios.get
const fakePost = {
  _id: "1",
  title: "Test Title",
  description: "This is a test description",
  scamType: "Phishing",
  likes: [],
  comments: [],
};

beforeEach(() => {
  // reset mocks
  axios.get.mockReset();
  axios.put.mockReset();
  axios.post.mockReset();

  // default behaviors
  axios.get.mockResolvedValue({ data: fakePost });
  axios.put.mockResolvedValue({ data: { likes: ["user1"] } });
});

test("renders title, badge, description and toggles like count", async () => {
  render(
    <AuthContext.Provider value={{ user: { _id: "user1" } }}>
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for post data to load
  const heading = await screen.findByRole("heading", { name: /Test Title/i });
  expect(heading).toBeInTheDocument();

  expect(screen.getByText("Phishing")).toBeInTheDocument();
  expect(screen.getByText("This is a test description")).toBeInTheDocument();

  // like button starts at 0
  const likeBtn = screen.getByRole("button", { name: /0/ });
  expect(likeBtn).toBeInTheDocument();

  fireEvent.click(likeBtn);

  // now it should show 1
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /1/ })).toBeInTheDocument()
  );
});

// 2. testing comment section
test("submits a new comment correctly", async () => {
  // mock the POST /comment response
  axios.post.mockResolvedValue({
    data: { _id: "new_comment_id", text: "New comment", userId: { username: "user1" } },
  });

  render(
    <AuthContext.Provider value={{ user: { _id: "user1" } }}>
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for the post to load
  await screen.findByRole("heading", { name: /Test Title/i });

  const commentInput = screen.getByPlaceholderText("Write a comment…");
  fireEvent.change(commentInput, { target: { value: "New comment" } });

  const submitButton = screen.getByRole("button", { name: /Post/ });
  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledWith("/posts/1/comment", {
    text: "New comment",
  });

  // wait for the new comment to appear in the list
  expect(await screen.findByText("New comment")).toBeInTheDocument();
});

// Test: clicking the "← Back" button should call navigate(-1)
// We're mocking useNavigate(), rendering the component, waiting for load,
// then clicking the back button and asserting navigate(-1).
test("clicking the Back button navigates to the previous page", async () => {
  const navigate = jest.fn();
  router.useNavigate.mockReturnValue(navigate);

  render(
    <AuthContext.Provider value={{ user: { _id: "user1" } }}>
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for data load
  await screen.findByRole("heading", { name: /Test Title/i });

  // click the Back button
  fireEvent.click(screen.getByRole("button", { name: /← Back/ }));

  // verify navigation
  expect(navigate).toHaveBeenCalledWith(-1);
});

// Test: delete-post icon only renders for the author
// We override axios.get to return a post whose userId matches our user,
// render, wait for load, and assert that the delete icon is present.
test("shows delete-post icon only for the author", async () => {
  const authorPost = {
    ...fakePost,
    userId: { _id: "user1", username: "user1" }
  };
  axios.get.mockResolvedValueOnce({ data: authorPost });

  const { container } = render(
    <AuthContext.Provider value={{ user: { _id: "user1" } }}>
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for data load
  await screen.findByRole("heading", { name: /Test Title/i });

  // assert delete icon presence
  expect(container.querySelector(".detail-delete-btn")).toBeInTheDocument();
});
