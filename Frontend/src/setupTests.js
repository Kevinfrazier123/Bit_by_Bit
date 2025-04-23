// src/setupTests.js
import "@testing-library/jest-dom";

// stub axios so its real ESM never runs
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// stub react‑tsparticles so Jest never tries to load its ESM source
jest.mock("react-tsparticles", () => () => null);

// stub tsparticles loadFull import
jest.mock("tsparticles", () => ({
  loadFull: jest.fn(),
}));
