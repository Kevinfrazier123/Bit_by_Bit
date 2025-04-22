// src/pages/post/PostDetail.test.jsx
// <-- stub out axios first, so Jest never loads the real module
jest.mock("axios", () => ({
    get: jest.fn(),
    put: jest.fn(),
  }));
  
  import React from "react";
  import { render, screen, fireEvent, waitFor } from "@testing-library/react";
  import { MemoryRouter, Route, Routes } from "react-router-dom";
  import PostDetail from "./PostDetail.jsx";  import { AuthContext } from "../../context/AuthContext";
  import axios from "axios";
  
  // mock post data
  const fakePost = {
    _id: "1",
    title: "Test Title",
    description: "This is a test description",
    scamType: "Phishing",
    likes: [],
    comments: [],
  };
  
  beforeEach(() => {
    // every test, have axios.get return our fake post
    axios.get.mockResolvedValue({ data: fakePost });
    // and axios.put (like toggleLike) returns likes=[user1]
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
  
    // Wait for the title to appear
    expect(
      await screen.findByRole("heading", { name: /Test Title/i })
    ).toBeInTheDocument();
  
    // badge and desc
    expect(screen.getByText("Phishing")).toBeInTheDocument();
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  
    // like button should start at 0
    const likeBtn = screen.getByRole("button", { name: /0/i });
    expect(likeBtn).toBeInTheDocument();
  
    // click it
    fireEvent.click(likeBtn);
  
    // now it should show 1
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /1/i })).toBeInTheDocument()
    );
  });
  