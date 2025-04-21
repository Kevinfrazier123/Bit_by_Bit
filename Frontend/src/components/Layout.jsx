// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import BackToTop from "./backToTop/BackToTop";
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <BackToTop />

    </>
  );
}
