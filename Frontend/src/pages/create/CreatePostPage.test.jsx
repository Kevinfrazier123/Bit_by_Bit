// src/pages/create/CreatePostPage.test.jsx

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePostPage from "./CreatePostPage.jsx";
import { AuthContext } from "../../context/AuthContext";

// Mock axios.post so we can inspect calls
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

describe("CreatePostPage", () => {
  let navigateSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    navigateSpy = jest.fn();
    router.useNavigate.mockReturnValue(navigateSpy);
  });

  // Test 1: If there's no user in context, submitting the form should redirect to "/login"
  test("redirects to /login when user is not logged in", async () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <CreatePostPage />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    // We never call axios.post because user is null
    expect(axios.post).not.toHaveBeenCalled();
    // Redirect to login
    expect(navigateSpy).toHaveBeenCalledWith("/login");
  });

  // Test 2: Selecting a scam type updates the select value in the form
  test("updates scam type select correctly", () => {
    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePostPage />
      </AuthContext.Provider>
    );

    const select = screen.getByRole("combobox", { name: /Scam Type/i });
    // Default should be "Phishing"
    expect(select.value).toBe("Phishing");

    // Change to "Other"
    fireEvent.change(select, { target: { value: "Other" } });
    expect(select.value).toBe("Other");
  });

  // Test 3: Entering hashtags splits and appends correctly to FormData
  test("splits comma-separated tags into form data", async () => {
    axios.post.mockResolvedValue({});
    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePostPage />
      </AuthContext.Provider>
    );

    // fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Enter a short, descriptive title/i), {
      target: { value: "My Title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Describe the scam experience/i), {
      target: { value: "Details here." },
    });
    // enter tags with extra spaces and empty entries
    fireEvent.change(screen.getByPlaceholderText(/#hashtags/i), {
      target: { value: " foo,  bar , ,baz, " },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Inspect the FormData passed to axios.post
    const formDataArg = axios.post.mock.calls[0][1];
    // Should have three hashtags
    expect(formDataArg.getAll("hashtags")).toEqual(["foo", "bar", "baz"]);
  });

  // Test 4: Uploading files and submitting sends them in FormData and navigates to "/forum"
  test("includes image and attachment files and navigates to forum on success", async () => {
    axios.post.mockResolvedValue({});
    render(
      <AuthContext.Provider value={{ user: { _id: "u1" } }}>
        <CreatePostPage />
      </AuthContext.Provider>
    );

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Enter a short, descriptive title/i), {
      target: { value: "Title2" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Describe the scam experience/i), {
      target: { value: "Description2" },
    });

    // Create mock files
    const imageFile = new File(["img"], "photo.png", { type: "image/png" });
    const docFile = new File(["pdf"], "doc.pdf", { type: "application/pdf" });

    // Simulate file uploads
    fireEvent.change(screen.getByLabelText(/Upload Image/i), {
      target: { files: [imageFile] },
    });
    fireEvent.change(screen.getByLabelText(/Upload Document/i), {
      target: { files: [docFile] },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    const [url, formData] = axios.post.mock.calls[0];
    expect(url).toBe("/posts");
    // Check that files are present in FormData
    expect(formData.get("image")).toBe(imageFile);
    expect(formData.get("attachment")).toBe(docFile);

    // After success, navigation goes to forum
    expect(navigateSpy).toHaveBeenCalledWith("/forum");
  });
});
