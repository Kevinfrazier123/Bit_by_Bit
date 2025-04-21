import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/home/Home';
import Login from "./pages/login/Login";


import AboutUs from "./components/aboutUs/AboutUs";
import Forum from "./components/forum/Forum";
import ContactUs from "./components/contactUs/ContactUs";
import Profile from "./pages/profile/Profile";
import CreatePostPage from "./pages/create/CreatePostPage";
import PostDetail from "./pages/post/PostDetail";



function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home/>}/>       
      <Route path="/login" element={<Login/>}/>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/posts/:id" element={<PostDetail />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;