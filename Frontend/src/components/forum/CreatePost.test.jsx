// src/components/forum/CreatePost.test.jsx

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "./CreatePost.jsx";
import { AuthContext } from "../../context/AuthContext";

// Mock axios.post
jest.mock("axios", () => ({
  post: jest.fn(),
}));

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

describe("CreatePost Component", () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock = jest.fn();
    router.useNavigate.mockReturnValue(navigateMock);
  });

  test("renders form fields with default values", () => {
    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePost onCreated={jest.fn()} />
      </AuthContext.Provider>
    );

    const textarea = screen.getByPlaceholderText("Describe the scam experience…");
    expect(textarea.value).toBe("");

    const select = screen.getByRole("combobox");
    expect(select.value).toBe("Phishing");

    const tagsInput = screen.getByPlaceholderText("#hashtags (comma separated)");
    expect(tagsInput.value).toBe("");
  });

  test("submits form successfully and resets inputs", async () => {
    const fakeResponse = {
      data: {
        id: "p1",
        description: "Desc",
        scamType: "Phishing",
        hashtags: ["tag1"],
      },
    };
    axios.post.mockResolvedValueOnce(fakeResponse);
    const onCreatedMock = jest.fn();

    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePost onCreated={onCreatedMock} />
      </AuthContext.Provider>
    );

    // Fill in description and tags
    fireEvent.change(
      screen.getByPlaceholderText("Describe the scam experience…"),
      { target: { value: "Desc" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("#hashtags (comma separated)"),
      { target: { value: "tag1" } }
    );

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    // Wait for axios.post call
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "/posts",
        {
          description: "Desc",
          scamType: "Phishing",
          hashtags: ["tag1"],
        },
        { withCredentials: true }
      )
    );

    // onCreated callback
    expect(onCreatedMock).toHaveBeenCalledWith(fakeResponse.data);

    // Wait for inputs to reset
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Describe the scam experience…").value
      ).toBe("");
      expect(
        screen.getByPlaceholderText("#hashtags (comma separated)").value
      ).toBe("");
      expect(screen.getByRole("combobox").value).toBe("Phishing");
    });
  });

  test("sends selected scamType in payload", async () => {
    const fakeResponse = { data: {} };
    axios.post.mockResolvedValueOnce(fakeResponse);
    const onCreatedMock = jest.fn();

    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePost onCreated={onCreatedMock} />
      </AuthContext.Provider>
    );

    // Change scam type and fill description
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Investment" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe the scam experience…"),
      { target: { value: "Invest scam" } }
    );

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "/posts",
        expect.objectContaining({ scamType: "Investment" }),
        expect.any(Object)
      )
    );
  });

  test("alerts and redirects to login on 401 error", async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 401 } });
    window.alert = jest.fn();

    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePost onCreated={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Describe the scam experience…"),
      { target: { value: "Desc" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("You must log in to post.");
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});
