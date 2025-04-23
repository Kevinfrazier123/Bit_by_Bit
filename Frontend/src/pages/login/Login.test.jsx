// src/pages/login/Login.test.jsx

import React from "react";
import axios from "axios";
import * as router from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login.jsx";
import { AuthContext } from "../../context/AuthContext";

// Mock axios.post
jest.mock("axios", () => ({
  post: jest.fn(),
}));

// Mock useNavigate
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

describe("Login Component", () => {
  let dispatchMock, navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();
    navigateMock = jest.fn();
    router.useNavigate.mockReturnValue(navigateMock);
  });

  test("updates input fields on change", () => {
    render(
      <AuthContext.Provider value={{ loading: false, error: null, dispatch: dispatchMock }}>
        <Login />
      </AuthContext.Provider>
    );

    const userInput = screen.getByPlaceholderText("Username");
    const passInput = screen.getByPlaceholderText("Password");
    fireEvent.change(userInput, { target: { value: "testuser" } });
    fireEvent.change(passInput, { target: { value: "secret" } });

    expect(userInput.value).toBe("testuser");
    expect(passInput.value).toBe("secret");
  });

  test("disables Sign In button when loading", () => {
    render(
      <AuthContext.Provider value={{ loading: true, error: null, dispatch: dispatchMock }}>
        <Login />
      </AuthContext.Provider>
    );

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    expect(signInButton).toBeDisabled();
  });

  test("dispatches success and navigates on correct credentials", async () => {
    const fakeUser = { id: "u1", name: "Test User" };
    axios.post.mockResolvedValue({ data: { user: fakeUser } });

    render(
      <AuthContext.Provider value={{ loading: false, error: null, dispatch: dispatchMock }}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "correctUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correctPass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(dispatchMock).toHaveBeenCalledWith({ type: "LOGIN_START" });

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "LOGIN_SUCCESS",
        payload: fakeUser,
      });
      expect(navigateMock).toHaveBeenCalledWith("/forum");
    });
  });

  test("dispatches failure on incorrect credentials", async () => {
    const errorResponse = { message: "Invalid credentials" };
    axios.post.mockRejectedValue({ response: { data: errorResponse } });

    render(
      <AuthContext.Provider value={{ loading: false, error: null, dispatch: dispatchMock }}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongPass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(dispatchMock).toHaveBeenCalledWith({ type: "LOGIN_START" });

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "LOGIN_FAILURE",
        payload: errorResponse,
      });
    });
  });

  test("displays error message from context", () => {
    const errorObj = { message: "Invalid credentials" };
    render(
      <AuthContext.Provider value={{ loading: false, error: errorObj, dispatch: dispatchMock }}>
        <Login />
      </AuthContext.Provider>
    );

    expect(screen.getByText(errorObj.message)).toBeInTheDocument();
  });
});
