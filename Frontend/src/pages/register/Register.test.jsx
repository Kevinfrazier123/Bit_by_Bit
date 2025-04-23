// src/pages/register/Register.test.jsx

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register.jsx";
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

describe("Register Component", () => {
  let dispatchMock, navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();
    navigateMock = jest.fn();
    router.useNavigate.mockReturnValue(navigateMock);
  });

  // Test 1: dispatches REGISTER_FAILURE when passwords do not match
  test("dispatches REGISTER_FAILURE when passwords do not match", () => {
    render(
      <AuthContext.Provider value={{ loading: false, error: null, dispatch: dispatchMock }}>
        <Register />
      </AuthContext.Provider>
    );

    // Fill form fields
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "user1" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "pass321" } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Expect REGISTER_FAILURE dispatched with mismatch message
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "REGISTER_FAILURE",
      payload: { message: "Passwords do not match" },
    });

    // axios.post should not be called
    expect(axios.post).not.toHaveBeenCalled();
  });

  // Test 2: successful registration dispatches REGISTER_START, REGISTER_SUCCESS, and navigates to /login
  test("submits form successfully and navigates to login", async () => {
    const fakeResponse = { data: { id: "u1", username: "user1" } };
    axios.post.mockResolvedValue(fakeResponse);

    render(
      <AuthContext.Provider value={{ loading: false, error: null, dispatch: dispatchMock }}>
        <Register />
      </AuthContext.Provider>
    );

    // Fill form with matching passwords
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "user1" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "pass123" } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // REGISTER_START should be dispatched immediately
    expect(dispatchMock).toHaveBeenCalledWith({ type: "REGISTER_START" });

    // Wait for axios and subsequent dispatch/navigate calls
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "REGISTER_SUCCESS",
        payload: fakeResponse.data,
      });
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});
