// src/pages/home/Home.test.jsx

import React from "react";
import * as router from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home.jsx";

// Mock useNavigate from react-router-dom, preserving other exports
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

describe("Home Component", () => {
  let navigateSpy;

  beforeEach(() => {
    // each test, give useNavigate a fresh spy
    navigateSpy = jest.fn();
    router.useNavigate.mockReturnValue(navigateSpy);
  });

  // Test 1: Static hero content should render correctly
  test("renders hero heading, description, and trusted text", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // The main title
    expect(screen.getByRole("heading", { name: /Bit by Bit/i })).toBeInTheDocument();
    // The subtitle paragraph
    expect(
      screen.getByText(/Stay alert\. Stay safe\. Report and discuss online scams in one place\./i)
    ).toBeInTheDocument();
    // The trusted-text span
    expect(
      screen.getByText(/Trusted by 500\+ users to report scams safely\./i)
    ).toBeInTheDocument();
  });

  // Test 2: Pressing Enter in the search input navigates with the encoded query
  test("navigates to /search when pressing Enter in search input", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search scam reports…/i);
    fireEvent.change(input, { target: { value: " test query " } });
    // simulate Enter key
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // should trim and encode the query
    expect(navigateSpy).toHaveBeenCalledWith("/search?q=test%20query");
  });

  // Test 3: Clicking the search button navigates with the encoded query
  test("navigates to /search when clicking the search button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search scam reports…/i);
    const button = screen.getByRole("button", { name: "🔍" });

    fireEvent.change(input, { target: { value: "foo&bar" } });
    fireEvent.click(button);

    expect(navigateSpy).toHaveBeenCalledWith("/search?q=foo%26bar");
  });

  // Test 4: Clicking the About Us and Login buttons navigates to the correct routes
  test("navigates to /about and /login when hero buttons clicked", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const aboutBtn = screen.getByRole("button", { name: /About Us/i });
    const loginBtn = screen.getByRole("button", { name: /Login/i });

    fireEvent.click(aboutBtn);
    expect(navigateSpy).toHaveBeenCalledWith("/about");

    fireEvent.click(loginBtn);
    expect(navigateSpy).toHaveBeenCalledWith("/login");
  });
});
