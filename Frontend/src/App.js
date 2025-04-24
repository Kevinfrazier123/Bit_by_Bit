// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register.jsx";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";  // ← correct path
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AboutUs from "./components/aboutUs/AboutUs";
import Forum from "./components/forum/Forum";
import ContactUs from "./components/contactUs/ContactUs";
import Profile from "./pages/profile/Profile";
import CreatePostPage from "./pages/create/CreatePostPage";
import PostDetail from "./pages/post/PostDetail";
import SearchResults from "./pages/search/SearchResults.jsx";
import NewsFeed from "./pages/news/NewsFeed";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/forum" element={<Forum />} />

          {/* Only render Profile if user is authenticated */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<NewsFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
